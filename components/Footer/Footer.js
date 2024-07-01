export const Footer = () => {
    return <footer className='bg-gray-800 p-10'>
        <form>
            <fieldset className="flex gap-2">
                <textarea className="w-full resize-none rounded-md bg-gray-700 p-2 text-white focus:border-emerald-500 focus:bg-gray-600 focus:outline focus:outline-emerald-500" placeholder="Send a message" />
                <button className="rounded-md bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600" type="submit">Send</button>
            </fieldset>
        </form>
    </footer>
}