import { Message } from "src/shared/types"
import { BotBadge, PFP } from "."

export default function MessageC({ message, extraClass }: { message: Message, extraClass?: string[] }) {
    return <div id="message" className={"hover" + (extraClass ? " " + extraClass.join(" ") : "")}>
        <div id="messagecontent">
            {!extraClass?.includes("anothermessage") && <PFP src={message.author.avatar} height={42} width={42}/>}
            <div id="content">
                {!extraClass?.includes("anothermessage") &&
                    <div>
                        <p id="username" style={{color: message.author.displayColor}}>{message.author.displayName}</p>
                        {(message.author.bot || message.author.webhook) && <BotBadge member={message.author} />}
                        <p id="time">{message.createdAt}</p>
                    </div>
                }
                <div id="msg">
                    <p id="msgcontent">{message.content}</p>
                </div>
            </div>
        </div>
    </div>
}