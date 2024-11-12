local json = require("json")

if not INITIALIZED then INITIALIZED = false end
if not SCORETABLE then SCORETABLE = {} end


Handlers.add("Initialize",
    Handlers.utils.hasMatchingTag("Action", "Initialize"),
    function(msg)
        if msg.Data then
            print("Initialize message: " .. msg.Data)
        else
            print("Initialize message received (no data)")
        end


        if not INITIALIZED then
            INITIALIZED = true

            Send({
                Target = msg.From,
                Data = json.encode({
                    status = "success",
                    message = "Game initialized"
                })
            })

            return
        end

        Send({
            Target = msg.From,
            Data = json.encode({
                status = "success",
                message = "Game already initialized"
            })
        })
    end

)

Handlers.add("SaveScore",
    Handlers.utils.hasMatchingTag("Action", "SaveScore"),
    function(msg)
        if not INITIALIZED then
            Send({
                Target = msg.From,
                Data = json.encode({
                    status = "error",
                    message = "Game not initialized"
                })
            })
            return
        end

        if not msg.Data then
            Send({
                Target = msg.From,
                Data = json.encode({
                    status = "error",
                    message = "No score provided"
                })
            })
            return
        end

        local score = tonumber(msg.Data)
        print(score)
        if not score then
            Send({
                Target = msg.From,
                Data = json.encode({
                    status = "error",
                    message = "Invalid score provided"
                })
            })
            return
        end

        local newScore = {
            score = score,
            wallet = msg.From,
            timestamp = os.time()
        }
        print(newScore)

        -- Check if the wallet (msg.From) matches the wallet in SCORETABLE
        local found = false
        for i, s in ipairs(SCORETABLE) do
            if s.wallet == msg.From then
                -- Update the existing score by adding the new score
                s.score = s.score + score
                s.timestamp = os.time() -- Update the timestamp
                found = true
                break
            end
        end

        -- If the wallet doesn't exist, add a new entry
        if not found then
            table.insert(SCORETABLE, newScore)
        end

        print(SCORETABLE)
        Send({
            Target = msg.From,
            Data = json.encode({
                status = "success",
                message = "Score saved"
            })
        })
    end
)


Handlers.add("GetScore",
    Handlers.utils.hasMatchingTag("Action", "GetScore"),
    function(msg)
        if not INITIALIZED then
            Send({
                Target = msg.From,
                Data = json.encode({
                    status = "error",
                    message = "Game not initialized"
                })
            })
            return
        end

        local wallet = msg.From
        if not wallet then
            Send({
                Target = msg.From,
                Data = json.encode({
                    status = "error",
                    message = "No wallet provided"
                })
            })
            return
        end

        for i, s in ipairs(SCORETABLE) do
            if s.wallet == wallet then
                Send({
                    Target = msg.From,
                    Data = json.encode({
                        status = "success",
                        message = "Score retrieved",
                        score = s.score
                    })
                })
                return
            end
        end
    end
)


Handlers.add("GetAllScores",
    Handlers.utils.hasMatchingTag("Action", "GetAllScores"),
    function(msg)
        print("Processing GetAllScores request for top 10 scores")

        -- Get the top 10 scores
        local allScores = {}
        for i = 1, math.min(10, #SCORETABLE) do
            table.insert(allScores, SCORETABLE[i])
        end

        if #allScores == 0 then
            Send({
                Target = msg.From,
                Data = json.encode({
                    status = "success",
                    message = "No scores available",
                    data = {}
                })
            })
            return
        end

        Send({
            Target = msg.From,
            Data = json.encode({
                status = "success",
                message = "Top 10 scores retrieved successfully",
                data = allScores
            })
        })
    end
)


return Handlers
