type Stif = {
    version: {
        major: 0,
        minor: 1,
        patch: 1,
    },
    name: string,
    tiers: {
        color: string,
        name: string
    }[],
    items: {
        name: string,
        tier: number,
        image: string,
    }[],
};

const TierListEditor = () => {
    return <div className="border-x border-black bg-[#1a1a17] flex flex-col">
        <Tier />
        <Tier />
        <Tier />
    </div>
}

const Tier = () => {
    return <div className="border-y border-black min-h-[80px] flex flex-row">
        <div style={{
            backgroundColor: 'rgb(255, 127, 127)'
        }} className="w-[100px] h-[80px] flex items-center justify-center">
            <span>S</span>
        </div>
        <div className="flex-1 flex-row flex-wrap flex">
            <img className="w-[80px] h-[80px] object-cover block" src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Approksimoidaan_py%C3%B6re%C3%A4_lehm%C3%A4.jpg/440px-Approksimoidaan_py%C3%B6re%C3%A4_lehm%C3%A4.jpg"></img>
            <img className="w-[80px] h-[80px] object-cover block" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Spot_the_cow.gif/338px-Spot_the_cow.gif"></img>
            <img className="w-[80px] h-[80px] object-cover block" src="https://upload.wikimedia.org/wikipedia/commons/2/23/SphericalCow2.gif"></img>
        </div>
    </div >
}

export default TierListEditor;