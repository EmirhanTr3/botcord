import { Guild, Member } from "src/shared/types"
import PFP from "./pfp"
import { useLocalStorage } from "usehooks-ts"
import Channel from "./channel"
import Category from "./category"
import { useUserModal } from "../hooks"
import { Link } from "@tanstack/react-router"

export default function Sidebar2({ guild }: { guild: Guild }) {
    const [clientUser] = useLocalStorage<Member>("clientUser", JSON.parse(localStorage.getItem("clientUser")!))
    const [UserModal, isUserModalOpen, toggleUserModal] = useUserModal(clientUser)
    
    return <>
        {isUserModalOpen && UserModal}

        <div id="sidebar2">
            <div id="guild">
                <h1 id="guildname">{guild.name}</h1>
                <div id="channels">
                    {guild.channels.filter(c => c.type !== 4 && !c.parent).map(channel => {
                        return <Channel key={channel.id} channel={channel}/>
                    })}

                    {guild.channels.filter(c => c.type == 4).map(channel => {
                        return <Category key={channel.id} category={channel}>
                            {guild.channels.filter(c => c.parent?.id == channel.id).map(c => {
                                return <Channel key={c.id} channel={c}/>
                            })}
                        </Category>
                    })}
                </div>
            </div>
            <div id="user" className="hover" onClick={toggleUserModal}>
                <PFP height={24} width={24} src={clientUser.avatar}/>
                <p id="username">{clientUser.name}</p>
            </div>
            <Link to="/settings" search={{redirect: window.location.pathname}}>
                <div id="settingsbutton" className="hover">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#d1d1d1" viewBox="0 0 256 256"><path d="M128,76a52,52,0,1,0,52,52A52.06,52.06,0,0,0,128,76Zm0,80a28,28,0,1,1,28-28A28,28,0,0,1,128,156Zm92-27.21v-1.58l14-17.51a12,12,0,0,0,2.23-10.59A111.75,111.75,0,0,0,225,71.89,12,12,0,0,0,215.89,66L193.61,63.5l-1.11-1.11L190,40.1A12,12,0,0,0,184.11,31a111.67,111.67,0,0,0-27.23-11.27A12,12,0,0,0,146.3,22L128.79,36h-1.58L109.7,22a12,12,0,0,0-10.59-2.23A111.75,111.75,0,0,0,71.89,31.05,12,12,0,0,0,66,40.11L63.5,62.39,62.39,63.5,40.1,66A12,12,0,0,0,31,71.89,111.67,111.67,0,0,0,19.77,99.12,12,12,0,0,0,22,109.7l14,17.51v1.58L22,146.3a12,12,0,0,0-2.23,10.59,111.75,111.75,0,0,0,11.29,27.22A12,12,0,0,0,40.11,190l22.28,2.48,1.11,1.11L66,215.9A12,12,0,0,0,71.89,225a111.67,111.67,0,0,0,27.23,11.27A12,12,0,0,0,109.7,234l17.51-14h1.58l17.51,14a12,12,0,0,0,10.59,2.23A111.75,111.75,0,0,0,184.11,225a12,12,0,0,0,5.91-9.06l2.48-22.28,1.11-1.11L215.9,190a12,12,0,0,0,9.06-5.91,111.67,111.67,0,0,0,11.27-27.23A12,12,0,0,0,234,146.3Zm-24.12-4.89a70.1,70.1,0,0,1,0,8.2,12,12,0,0,0,2.61,8.22l12.84,16.05A86.47,86.47,0,0,1,207,166.86l-20.43,2.27a12,12,0,0,0-7.65,4,69,69,0,0,1-5.8,5.8,12,12,0,0,0-4,7.65L166.86,207a86.47,86.47,0,0,1-10.49,4.35l-16.05-12.85a12,12,0,0,0-7.5-2.62c-.24,0-.48,0-.72,0a70.1,70.1,0,0,1-8.2,0,12.06,12.06,0,0,0-8.22,2.6L99.63,211.33A86.47,86.47,0,0,1,89.14,207l-2.27-20.43a12,12,0,0,0-4-7.65,69,69,0,0,1-5.8-5.8,12,12,0,0,0-7.65-4L49,166.86a86.47,86.47,0,0,1-4.35-10.49l12.84-16.05a12,12,0,0,0,2.61-8.22,70.1,70.1,0,0,1,0-8.2,12,12,0,0,0-2.61-8.22L44.67,99.63A86.47,86.47,0,0,1,49,89.14l20.43-2.27a12,12,0,0,0,7.65-4,69,69,0,0,1,5.8-5.8,12,12,0,0,0,4-7.65L89.14,49a86.47,86.47,0,0,1,10.49-4.35l16.05,12.85a12.06,12.06,0,0,0,8.22,2.6,70.1,70.1,0,0,1,8.2,0,12,12,0,0,0,8.22-2.6l16.05-12.85A86.47,86.47,0,0,1,166.86,49l2.27,20.43a12,12,0,0,0,4,7.65,69,69,0,0,1,5.8,5.8,12,12,0,0,0,7.65,4L207,89.14a86.47,86.47,0,0,1,4.35,10.49l-12.84,16.05A12,12,0,0,0,195.88,123.9Z"></path></svg>
                </div>
            </Link>
        </div>
    </>
}