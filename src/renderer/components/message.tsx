import { Message } from "src/shared/types"
import { BotBadge, PFP } from "."
import { useContextMenu, useUserModal } from "../hooks"
import { useEffect, useRef, useState } from "react"

export default function MessageC({ message, setReply, extraClass }: { message: Message, setReply: (reply: Message | undefined) => void, extraClass?: string[] }) {
    const [UserModal, isUserModalOpen, toggleUserModal] = useUserModal(message.author)
    const messageRef = useRef<HTMLDivElement>(null)
    const [msg, setMessage] = useState<Message>(message)
    const [ContextMenu, isContextMenuOpen, toggleContextMenu] = useContextMenu({
        autoClose: true,
        items: [
            {
                text: "Reply",
                callback(event, item) {
                    setReply(message)
                },
            },
            {
                text: "Copy Text",
                callback(event, item) {
                    navigator.clipboard.writeText(message.content)
                }
            },
            { type: "seperator" },
            {
                text: "Copy Message ID",
                callback(event, item) {
                    navigator.clipboard.writeText(message.id)
                },
            }
        ]
    })

    function downloadAttachment(url: string) {
        window.api.send("openURL", url)
    }

    useEffect(() => {
        function messageDelete(e: any, dmessage: Message) {
            if (dmessage.id == message.id) {
                window.api.removeListener("messageDelete", messageDelete)
                messageRef.current!.classList.add("deleted")
                console.log(`received messageDelete from ${dmessage.author.username}: ${dmessage.content}`)
            }
        }

        function messageUpdate(e: any, newMessage: Message) {
            if (newMessage.id == message.id) {
                window.api.removeListener("messageUpdate", messageUpdate)
                setMessage(newMessage)
                console.log(`received messageUpdate from ${newMessage.author.username}: ${newMessage.content}`)
            }
        }

        window.api.removeListener("messageDelete", messageDelete)
        window.api.addListener("messageDelete", messageDelete)
        window.api.removeListener("messageUpdate", messageUpdate)
        window.api.addListener("messageUpdate", messageUpdate)
    })

    return <>
        {isUserModalOpen && UserModal}
        {isContextMenuOpen && ContextMenu}
        
        <div ref={messageRef} id="message" className={"hover" + (extraClass ? " " + extraClass.join(" ") : "")} onContextMenu={(e) => !messageRef.current!.classList.contains("deleted") && toggleContextMenu(e)}>
            <div id="messagecontent">
                {!extraClass?.includes("anothermessage") && <PFP src={msg.author.avatar} height={42} width={42} onClick={toggleUserModal}/>}
                <div id="content">
                    {!extraClass?.includes("anothermessage") &&
                        <div>
                            <p id="username" style={{color: msg.author.displayColor}} onClick={toggleUserModal}>{msg.author.displayName}</p>
                            {(msg.author.bot || msg.author.webhook) && <BotBadge member={msg.author} />}
                            <p id="time">{msg.createdAt}</p>
                        </div>
                    }
                    <div id="msg">
                        <div id="msgcontent">
                            {msg.content}
                            {msg.editedTimestamp && <p id="edited">(edited)</p>}
                        </div>
                        {msg.embeds?.map((embed, index) => {
                            const data = embed.data
                            return <div key={index} id ="embed">
                                <div id="color" style={{background: "#" + (data.color ? data.color.toString(16).padStart(6, '0') : "101010")}} />
                                <div id="embedcontent">
                                    <div id="embedcontentdata">
                                        <div id="embedcontentdatacontent">
                                            {data.author && 
                                                <div id="author">
                                                    {data.author.icon_url && <img id="authoricon" src={data.author.icon_url} />}
                                                    {data.author.url ?
                                                        <a id="authorname" href={data.author.url}>{data.author.name}</a> :
                                                        <p id="authorname">{data.author.name}</p>
                                                    }
                                                </div>
                                            }
                                            {data.title && (
                                                data.url ?
                                                    <a id="title" href={data.url}>{data.title}</a> :
                                                    <p id="title">{data.title}</p>
                                                )}
                                            {data.description && <p id="description">{data.description}</p>}
                                            {data.fields &&
                                                <div id="fields">
                                                    {data.fields.map((field, index) =>
                                                        <div key={index} id="field">
                                                            <p id="fieldname">{field.name}</p>
                                                            <p id="fieldvalue">{field.value}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            }
                                        </div>
                                        {data.thumbnail && <img id="thumbnail" src={data.thumbnail.url}/>}
                                    </div>
                                    {data.image && <img id="image" src={data.image.url}/>}
                                    {data.footer &&
                                        <div id="footer">
                                            {data.footer.icon_url && <img id="footericon" src={data.footer.icon_url} />}
                                            <p id="footertext">{data.footer.text}</p>
                                        </div>
                                    }
                                </div>
                            </div>
                        })}
                        {msg.attachments?.map((attachment, index) => 
                            <div key={index} id="attachments">
                                {
                                    attachment.contentType?.startsWith("image") ? <img src={attachment.url}/> :
                                    attachment.contentType?.startsWith("video") ? <video src={attachment.url} controls/> :
                                    <div id="file">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="#ebebeb" viewBox="0 0 256 256"><path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM152,88V44l44,44Z"></path></svg>
                                        <div id="info">
                                            <p id="name">{attachment.name}</p>
                                            <p id="size">{attachment.size} bytes</p>
                                        </div>
                                        <svg id="download" className="hover" onClick={() => downloadAttachment(attachment.url)} xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="#ebebeb" viewBox="0 0 256 256"><path d="M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0Zm-101.66,5.66a8,8,0,0,0,11.32,0l40-40A8,8,0,0,0,168,96H136V32a8,8,0,0,0-16,0V96H88a8,8,0,0,0-5.66,13.66Z"></path></svg>
                                    </div>
                                }
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </>
}