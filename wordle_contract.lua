
local json = require("json")

if not INITIALIZED then INITIALIZED = false end

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

return Handlers