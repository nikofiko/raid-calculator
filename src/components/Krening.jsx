import React, { useEffect, useState } from "react";
import _ from 'lodash';

const Krening = () => {
    const [name, setName] = useState('');
    const [time, setTime] = useState('');
    const [initialTime, setInitialTime] = useState(null); // Nowy stan dla początkowego czasu
    const [czas, setCzas] = useState('');
    const [guy, setGuy] = useState(() => {
        const savedGuys = localStorage.getItem('raidGuys');
        return savedGuys ? JSON.parse(savedGuys) : [];
    });
    const [error, setError] = useState(false);

    const numberRegex = /^\d+$/;
    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;
    const fullDateRegex = /^[A-Za-z]{3} [A-Za-z]{3} \d{1,2} \d{4} ([01]\d|2[0-3]):[0-5]\d:[0-5]\d GMT[+-]\d{4} \(.+\)$/;

    useEffect(() => {
        localStorage.setItem('raidGuys', JSON.stringify(guy));
    }, [guy]);

    const formatTime = (date) => {
        return `${(date.getHours() < 10 ? '0' : '')}${date.getHours()}:${(date.getMinutes() < 10 ? '0' : '')}${date.getMinutes()}:${(date.getSeconds() < 10 ? '0' : '')}${date.getSeconds()}`;
    };

    const handleAdd = () => {
        if (!name.trim() || !czas.trim()) {
            setError(true);
            return;
        }
        if (!numberRegex.test(czas) || (!time.trim() && !timeRegex.test(time) && !fullDateRegex.test(time) && guy.length === 0)) {
            setError(true);
            return;
        }

        setGuy(prevGuy => {
            let baseTime;
            if (prevGuy.length === 0) {
                baseTime = time.trim() ? time : "00:00:00"; // Ustawiamy domyślny czas, jeśli pole jest puste
                setInitialTime(baseTime); // Zapisz początkowy czas przy pierwszym elemencie
            } else {
                baseTime = prevGuy[prevGuy.length - 1].time; // Użyj czasu ostatniego elementu
            }
            const date = new Date(`December 17, 1995 ${baseTime}`);
            date.setSeconds(date.getSeconds() + parseInt(czas));

            const col = _.sample(['bg-red-100 text-red-500', 'bg-green-100 text-green-500', 'bg-yellow-100 text-yellow-500', 'bg-purple-100 text-purple-500']);
            const newIndex = prevGuy.length + 1;

            const newGuy = {
                index: newIndex,
                color: col,
                name: name,
                czas: czas,
                time: formatTime(date)
            };

            const updatedGuys = [...prevGuy, newGuy];
            setTime(formatTime(date)); // Aktualizuj pole time
            return updatedGuys;
        });

        setName('');
        setCzas('');
        setError(false);
    };

    const handleKeyDown = () => {
        handleAdd();
    };

    const handleDelete = (indexToDelete) => {
        if (indexToDelete !== guy.length) {
            return; // Usuwamy tylko ostatni element
        }
        setGuy(prevGuy => {
            const filteredGuys = prevGuy.filter(g => g.index !== indexToDelete);
            if (filteredGuys.length === 0) {
                setTime(initialTime || ''); // Resetuj czas do początkowego, jeśli lista jest pusta
            }
            return filteredGuys.map((g, i) => ({
                ...g,
                index: i + 1
            }));
        });
    };

    const handleKeyDownEnter = (event) => {
        if (event.key === "Enter") {
            handleAdd();
        }
    };

    return (
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
                        <input className="text-gray-700 lg:max-w-40 outline-none border-1 border-gray-200 pl-3 py-1 rounded-xl" value={time} onChange={e => setTime(e.target.value)} type="text" placeholder="13:00:00" />
                        <input onKeyDown={handleKeyDownEnter} className="text-gray-700 max-h-[34px] lg:max-w-20 outline-none border-1 py-1 lg:py-0 border-gray-200 pl-3 rounded-xl" value={czas} onChange={e => setCzas(e.target.value)} type="number" placeholder="+s"/>
                        <button className="cursor-pointer flex items-center justify-center lg:justify-normal text-gray-700 max-h-[34px] pt-2 pb-2 px-5 rounded-xl bg-gray-100 text-[13px] font-semibold hover:opacity-80 transition-all duration-300" onClick={handleKeyDown}>ADD</button>
                    </div>
                </div>
            </div>

            <ul className="w-full max-w-[900px]">
            {guy.sort((a, b) => {
                    const timeA = new Date(`December 17, 1995 ${a.time}`).getTime();
                    const timeB = new Date(`December 17, 1995 ${b.time}`).getTime();
                    return timeA - timeB;
                })
                .map((g, index) => (
                    <li key={g.index} className="flex justify-between border-b py-2 border-gray-200 text-sm items-center first-of-type:border-t text-gray-700 px-2">
                        <div className="flex items-center">
                            <span className="w-7 flex justify-start">
                                {index + 1}.
                            </span>
                            <span className="flex gap-1 items-center">
                                <span>
                                    {g.name}
                                </span>
                                <span className={`${g.color} !bg-transparent font-semibold text-[12px] relative -top-1.5`}>
                                    +{g.czas}s
                                </span>
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            {g.index === guy.length && (
                                <div className="hover:bg-red-100 transition-all duration-300 text-red-500 px-2 py-1 rounded-xl cursor-pointer font-semibold">
                                    <button onClick={() => handleDelete(g.index)} className="cursor-pointer">delete</button>
                                </div>
                            )}
                            <div className={`${g.color} font-semibold rounded-xl flex justify-center items-center w-[77px] h-[28px]`}>
                                {g.time}
                            </div>
                        </div>
                    </li>
                ))}
        </ul>
        </div>
    );
};

export default Krening;