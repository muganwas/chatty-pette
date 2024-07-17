import { useUser } from "@auth0/nextjs-auth0/client";
import { faRobot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactMarkDown from 'react-markdown';
import Image from "next/image";
export const Message = ({ role, content }) => {
    const { user } = useUser();
    return <div className=
        {
            `grid grid-cols-[30px_1fr] gap-5 p-5 ${role === "assistant"
                ? "bg-gray-500"
                : role === "notice"
                    ? "bg-red-600"
                    : ""}`
        }
    >
        <div>
            {
                role === "user" && !!user
                    ? <Image src={user.picture} width={30} height={30} alt="user avatar" className="rounded-sm shadow-md shadow-black/50" />
                    : role === "assistant"
                        ? <div className="flex h-[30px] w-[30px] justify-center items-center rounded-sm shadow-md shadow-black/50 bg-gray-800">
                            <FontAwesomeIcon icon={faRobot} className="text-emerald-200" />
                        </div>
                        : <></>
            }
        </div>
        <div className="prose prose-invert">
            <ReactMarkDown>
                {content}
            </ReactMarkDown>
        </div>
    </div>
}