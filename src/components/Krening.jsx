import React, { useEffect, useRef, useState } from "react"
import _ from 'lodash';

const Krening = () => {
    const [name, setName] = useState('')
    const [time, setTime] = useState('')
    const [czas, setCzas] = useState('')
    const [guy, setGuy] = useState(() => {
        // Load from localStorage on initial render
        const savedGuys = localStorage.getItem('raidGuys');
        return savedGuys ? JSON.parse(savedGuys) : [];
    });
    const [error, setError] = useState(false);

    const numberRegex = /^\d+$/;
    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;
    const fullDateRegex = /^[A-Za-z]{3} [A-Za-z]{3} \d{1,2} \d{4} ([01]\d|2[0-3]):[0-5]\d:[0-5]\d GMT[+-]\d{4} \(.+\)$/

    useEffect(() => {
        localStorage.setItem('raidGuys', JSON.stringify(guy));
    }, [guy]);

    const handleKeyDown = (event) => {
        if(!name.trim() || !czas.trim()){
            setError(true)
        }else if(!numberRegex.test(czas) || (!time.trim() && !timeRegex.test(time) && !fullDateRegex.test(time))){
            setError(true)
        }else{
            const date1 = new Date(`December 17, 1995 ${time || "00:00:00"}`);
            console.log(date1.getSeconds())
            let seconds = date1.getSeconds() + parseInt(czas);  
            date1.setSeconds(seconds)
            setTime(`${date1.getHours()}:${date1.getMinutes()}:${date1.getSeconds()}`)
            
            const col = _.sample(['bg-red-100 text-red-500', 'bg-green-100 text-green-500', 'bg-yellow-100 text-yellow-500', 'bg-purple-100 text-purple-500']);
            console.log(col)
    
            setGuy(prevGuy => [...prevGuy, {
                color: col,
                name: name,
                czas: czas,
                time: `${(date1.getHours() < 10) ? '0' : ''}${date1.getHours()}:${(date1.getMinutes() < 10) ? '0' : ''}${date1.getMinutes()}:${(date1.getSeconds() < 10) ? '0' : ''}${date1.getSeconds()}`
            }]);
            
            console.log('a', date1)
            setName('')
            setCzas('')
            setError(false)
        }
    };

    const handleDelete = (nameToDelete, czasToRemove) => {
        const guyToRemove = guy.find(g => g.name === nameToDelete);
        setGuy(prevGuy => prevGuy.filter(g => g.name !== nameToDelete));
    
        if (guyToRemove && time) {
            const date1 = new Date(`December 17, 1995 ${time}`);
            let seconds = date1.getSeconds() - parseInt(czasToRemove);
            date1.setSeconds(seconds);
            
            const newTime = `${(date1.getHours() < 10 ? '0' : '')}${date1.getHours()}:${(date1.getMinutes() < 10 ? '0' : '')}${date1.getMinutes()}:${(date1.getSeconds() < 10 ? '0' : '')}${date1.getSeconds()}`;
            setTime(newTime);
        }
    };

    const handleKeyDownEnter = (event) => {
        if(event.key === "Enter"){
            if(!name.trim() || !czas.trim()){
                setError(true)
            }else if(!numberRegex.test(czas) || (!time.trim() && !timeRegex.test(time) && !fullDateRegex.test(time))){
                setError(true)
            }else{
                const date1 = new Date(`December 17, 1995 ${time || "00:00:00"}`);
                console.log(date1.getSeconds())
                let seconds = date1.getSeconds() + parseInt(czas);  
                date1.setSeconds(seconds)
                setTime(`${date1.getHours()}:${date1.getMinutes()}:${date1.getSeconds()}`)
                
                const col = _.sample(['bg-red-100 text-red-500', 'bg-green-100 text-green-500', 'bg-yellow-100 text-yellow-500', 'bg-purple-100 text-purple-500']);
                console.log(col)
        
                setGuy(prevGuy => [...prevGuy, {
                    color: col,
                    name: name,
                    czas: czas,
                    time: `${(date1.getHours() < 10) ? '0' : ''}${date1.getHours()}:${(date1.getMinutes() < 10) ? '0' : ''}${date1.getMinutes()}:${(date1.getSeconds() < 10) ? '0' : ''}${date1.getSeconds()}`
                }]);
                
                console.log('a', date1)
                setName('')
                setCzas('')
                setError(false)
            }
        }
        
    };

    return(

        <div className="flex flex-col gap-10 justify-center items-center">
        <a className="cursor-pointer absolute top-4 right-4 bg-yellow-200 py-2 px-4 rounded-full text-[12px]" target="blank" href="https://buymeacoffee.com/nicodemm">Buy me ☕</a>
        <div className="max-w-fit mx-auto flex flex-col gap-5">
        <div className="flex justify-center items-center">
            <h1 className="text-3xl lg:text-5xl font-semibold text-gray-700">Raid Calculator</h1>
        </div>
        <p className={`${!error ? 'hidden' : 'block text-[12px] text-red-600 font-bold'}`}>input cannot be empty</p>
    
        <div className="flex flex-col">
            <div className="flex flex-col lg:flex-row justify-between gap-2">
                <input className="text-gray-700 lg:max-w-38 max-h-[34px] outline-none border-1 border-gray-200 pl-3 rounded-xl py-1 lg:py-0" value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Name " />
                <input className="text-gray-700 lg:max-w-40 outline-none border-1 border-gray-200 pl-3 py-1 rounded-xl" onChange={e => setTime(e.target.value)} type="text" placeholder="13:00:00" />
                <input onKeyDown={handleKeyDownEnter} className="text-gray-700 max-h-[34px] lg:max-w-20 outline-none border-1 py-1 lg:py-0 border-gray-200 pl-3 rounded-xl" value={czas} onChange={e => setCzas(e.target.value)} type="number" placeholder="+s"/>
                <button className="cursor-pointer flex items-center justify-center lg:justify-normal text-gray-700 max-h-[34px] pt-2 pb-2 px-5 rounded-xl bg-gray-100 text-[13px] font-semibold hover:opacity-80 transition-all duration-300" onClick={handleKeyDown}>ADD</button>
            </div>
        </div>
        </div>

        <ul className="w-full max-w-[900px]">
            {guy.sort(guy.time).map((guy, index) =>
                <li key={guy.name} className="flex justify-between border-b py-2 border-gray-200 text-sm items-center first-of-type:border-t text-gray-700 px-2">
                    <div className="flex items-center">
                        <span className="w-7 flex justify-start">
                            {index + 1}.
                        </span>
                        <span className="flex gap-1 items-center">
                            <span>
                                {guy.name}  
                            </span>
                            <span className={`${guy.color} !bg-transparent font-semibold text-[12px] relative -top-1.5`}>
                                +{guy.czas}s
                            </span>
                        </span>
                   
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`${guy.color} font-semibold rounded-xl flex justify-center items-center w-[77px] h-[28px]`}>
                            {guy.time}
                        </div>
                        <div className="hover:bg-red-100 transition-all duration-300 text-red-500 px-2 py-1 rounded-xl cursor-pointer font-semibold">
                            <button onClick={() => handleDelete(guy.name, guy.czas)} className="cursor-pointer">delete</button>
                        </div>
                    </div>
                </li>
            )}
        </ul>



        
        {/* <input onKeyDown={handleKeyDown} onChange={e => setTask(e.target.value)} type="text" placeholder="chuj"/> */}
        
        </div>
    )
}

export default Krening