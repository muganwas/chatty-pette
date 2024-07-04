export const Footer = ({ generatingResponse, message, setMessage, onSubmit }) => {
    return <footer className='bg-gray-800 p-10'>
        <form onSubmit={onSubmit}>
            <fieldset className="flex gap-2" disabled={generatingResponse}>
                <textarea
                    className="w-full resize-none rounded-md bg-gray-700 p-2 text-white focus:border-emerald-500 focus:bg-gray-600 focus:outline focus:outline-emerald-500"
                    placeholder={generatingResponse ? "" : "Send a message"}
                    value={message}
                    onChange={e => {
                        setMessage(e.target.value);
                    }}
                />
                <button className="btn" type="submit">Send</button>
            </fieldset>
        </form>
    </footer>
}