import React, { useState } from 'react'

const ExtractMap = () => {
    // State variables to hold form data
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState(0);
    const [salary, setSalary] = useState(0);
    const [range, setRange] = useState(50);

    // Function to handle form submission
    function handleSubmit(e) {
        e.preventDefault();
        console.log('Name:', name);
        console.log('Email:', email);
        console.log('Age:', age);
        console.log('Salary:', salary);
        console.log('Range:', range);
    }
    return (
        <div className='extractMap'>

            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </label>
                <br />
                <label>
                    Email:
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <br />
                <label>
                    Age:
                    <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
                </label>
                <br />
                <label>
                    Salary:
                    <input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} />
                </label>
                <br />
                <label>
                    Range:
                    <input type="range" value={range} min="0" max="100" onChange={(e) => setRange(e.target.value)} />
                    {range}
                </label>
                <br />
                <button type="submit">Submit</button>
            </form>

        </div>
    )
}

export default ExtractMap