import './App.css';
import group from "./assets/Group.png"
import search from "./assets/search.png"
import plus from "./assets/PlusIcon.png"
import arrow from "./assets/arrow.png"
import employee from "./assets/employee.png"
import roleI from "./assets/role.png"
import duration from "./assets/duration.png"
import dropdown from "./assets/dropdown.png"
import del from "./assets/delete.png"
import left from "./assets/left.png"
import right from "./assets/right.png"
import { useEffect, useRef, useState } from 'react';

const idb =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

const insertDataInIndexedDb = () => {
  if (!idb) {
    console.log("This browser doesn't support IndexedDB");
    return;
  }

  const request = idb.open("employee");

  request.onerror = function (event) {
    console.error("An error occurred with IndexedDB");
    console.error(event);
  };

  request.onupgradeneeded = function (event) {
    const db = request.result;

    if (!db.objectStoreNames.contains("employeeData")) {
      db.createObjectStore("employeeData", { keyPath: "id" });
    }
  };
};


function App() {

  const [isEmployee, setIsEmployee] = useState(false)
  const [showRoles, setShowRoles] = useState(false)
  const [isEdit, setisEdit] = useState(false)
  const [role, setRole] = useState("")
  const [name, setName] = useState("")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [employeeData, setEmployeeData] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState({})
  const [isFrom, setIsFrom] = useState(false)
  const [isTo, setIsTo] = useState(false)
  const [month, setMonth] = useState()
  const [year, setYear] = useState()
  const [selectedDate, setSelectedDate] = useState('')

  const firstRender = useRef(true)
  const roles = [
    { "id": 1, "name": "Product Designer" },
    { "id": 2, "name": "Flutter Developer" },
    { "id": 3, "name": "QA Tester" },
    { "id": 4, "name": "Product Owner" },
  ]

  const addEmployee = () => {
    setIsEmployee(true)
  }

  useEffect(() => {
    insertDataInIndexedDb()
    getEmployeeData()
  }, [])

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const elem = document.getElementById("main")
    elem.classList.add("bg-blue")
  }, [showRoles])

  const setTodayDate = (currentDate) => {
    const today = currentDate ? new Date(currentDate) : new Date()
    const date = +today.getDate()
    const month = +today.getMonth()
    const year = +today.getFullYear()
    setMonth(month)
    setYear(year)
    selectDate(date, month, year)
  }

  const handleRole = (id) => {
    const { name } = roles.find(role => role.id === id)
    setRole(name)
    setShowRoles(false)
  }

  const getEmployeeData = () => {
    const dbPromise = idb.open("employee");
    dbPromise.onsuccess = () => {
      const db = dbPromise.result;

      var tx = db.transaction("employeeData", "readonly");
      var userData = tx.objectStore("employeeData");
      const users = userData.getAll();

      users.onsuccess = (query) => {
        setEmployeeData(query.srcElement.result);
      };

      tx.oncomplete = function () {
        db.close();
      };
    };
    dbPromise.onerror = (error) => {
      console.log(error);
      alert("Some error occured, Please refresh and try again")
    }
  };

  const save = (event, id) => {
    const dbPromise = idb.open("employee");
    const check = to !== "No Date" ? new Date(from) < new Date(to) : true
    if (name && role && from && to && check) {
      dbPromise.onsuccess = () => {
        const db = dbPromise.result;

        var tx = db.transaction("employeeData", "readwrite");
        var userData = tx.objectStore("employeeData");
        let users
        const newTo = to === "No Date" ? "" : to
        if (!isEdit) {
          users = userData.put({
            id: employeeData.length + 1, name, role, from, to: newTo,
          });
        }
        else {
          users = userData.put({
            id: selectedEmployee.id, name, role, from, to: newTo,
          });
        }
        users.onsuccess = (query) => {
          tx.oncomplete = function () {
            db.close();
          };
          if (isEdit) alert("User updated!");
          else alert("User created!");
          setName("");
          setRole("");
          setFrom("")
          setTo("")
          event.preventDefault();
          getEmployeeData()
          setIsEmployee(false)
          setisEdit(false)

        };
      };
    } else {
      if (!check) alert("'To Date' should be less that 'From Date'")
      else alert("Please enter all details");
    }
  };

  const deleteEmployee = (event, id) => {
    const dbPromise = idb.open("employee");

    dbPromise.onsuccess = () => {
      const db = dbPromise.result;

      var tx = db.transaction("employeeData", "readwrite");
      var userData = tx.objectStore("employeeData");
      const users = userData.delete(id);

      users.onsuccess = (query) => {
        tx.oncomplete = function () {
          db.close();
        };
        alert("User deleted!");
        setName("");
        setRole("");
        setFrom("")
        setTo("")
        event.preventDefault();
        getEmployeeData()
        setIsEmployee(false)
        setisEdit(false)
      };
    };
  }

  const handleEdit = (data) => {
    setSelectedEmployee(data)
    setisEdit(true)
    setIsEmployee(true)
    setName(data.name)
    setRole(data.role)
    setFrom(data.from)
    setTo(data.to)
  }

  const handleFromDate = (id) => {
    if (id === 1) {
      setIsFrom(true)
      if(from){
        setTodayDate(from)
      }
      else setTodayDate("")
    }
    else {
      setIsTo(true)
      if(!isEdit) setSelectedDate("No Date")
      else if(to){
        setTodayDate(to)
      }
      else setTodayDate("")
    }
  }

  const selectDate = (date, month, year) => {
    const selectedDate = `${date}  ${monthNames[month]} ${year}`
    setSelectedDate(selectedDate);
  }

  const generateCalendar = (month, year) => {
    const today = new Date();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    const dates = [];
  
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 0; i < 7; i++) {
      dates.push(
        <div key={`day${i}`} className="day">
          {dayNames[i]}
        </div>
      );
    }
  
    let newFrom = null;
    if (isTo) {
      newFrom = from ? new Date(from) : null;
    }
    const firstDateOfCurrentMonth = new Date(year, month, 1);
  
    for (let i = 0; i < firstDay; i++) {
      dates.push(
        <div key={`empty${i}`} className="date empty" />
      );
    }
  
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = +selectedDate.split(" ")[0] === day;
      const isDisabled = (newFrom !== null && date < newFrom) || date < firstDateOfCurrentMonth;
  
      dates.push(
        <div
          key={day}
          className={`date ${isSelected && 'selected'} ${isToday && 'today'} ${isDisabled && 'disabled'}`}
          id={day}
          onClick={(e) => selectDate(e.target.id, month, year)}
        >{day}
        </div>
      );
    }
    return dates;
  };
  
  const decreaseMonth = () => {
      if (month === 0) {
        setYear(prev => prev - 1)
        setMonth(11)
      }
      else setMonth(prev => prev - 1)
  }

  const increaseMonth = () => {
    if (month === 11) {
      setYear(prev => prev + 1)
      setMonth(0)
    }
    else setMonth(prev => prev + 1)
  }

  const setNewDate = (nextMonday) => {
    const date = +nextMonday.getDate()
    const month = +nextMonday.getMonth()
    const year = +nextMonday.getFullYear()
    setMonth(month)
    setYear(year)
    const newSelectedDate = `${date} ${monthNames[month]} ${year}`
    setSelectedDate(newSelectedDate)
  }

  const goToMonday = (id) => {
    const selected = new Date(selectedDate)
    const day = selected.getDay()
    const a = id === 1 ? 1 : 2
    const daysUntilNextMonday = a + (7 - day) % 7;
    const nextMonday = selected
    nextMonday.setDate(selected.getDate() + daysUntilNextMonday);
    setNewDate(nextMonday)
  }

  const selectToday = () => {
    const month = +new Date().getMonth()
    const year = +new Date().getFullYear()
    setMonth(month)
    setYear(year)
    selectDate(+new Date().getDate(), month, year)
  }
  const afterOneWeek = () => {
    const nextWeek = new Date(selectedDate);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setNewDate(nextWeek)
  }

  const cancelDate = () => {
    setSelectedDate('')
    setIsFrom(false)
    setIsTo(false)
  }

  const saveDate = (id) => {
    if (isFrom) setFrom(selectedDate)
    else setTo(selectedDate)
    setIsFrom(false)
    setIsTo(false)

  }

  const cancel = () => {
    setIsEmployee(false)
    setisEdit(false)
    setName("")
    setRole("")
    setFrom("")
    setTo("")
  }
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentEmployees = employeeData.filter(data => data.to === "")
  const previousEmployees = employeeData.filter(data => data.to !== "")

  return (
    <div className="flex flex-col h-screen w-screen font-robot overflow-hidden">
      <div className='bg-blue text-white font-bold text-xl relative h-[8%] w-full flex items-center justify-start px-2'>
        <span>{isEmployee ? (!isEdit ? "Add Employee Details" : "Edit Employee Details") : "Employee List"}</span>
        {isEdit && <img src={del} alt="Delete" className='absolute top-[50%] -translate-y-1/2 right-2' onClick={(e) => deleteEmployee(e, selectedEmployee.id)} />}
      </div>
      <div className={`flex flex-col justify-center items-center h-[92%] relative ${isEmployee ? "bg-white" : "bg-lightWhite"}`} id="main">
        {!isEmployee ? employeeData.length === 0 ? <div className='relative flex flex-col justify-center items-center'>
          <img src={group} alt="Nothing" />
          <img src={search} alt="Nothing" className='absolute top-[18px] left-[15px]' />
          <span className='font-bold text-darkBlue'>No employee records found</span>
        </div> :
          <div className='flex flex-col w-full h-full justify-start items-start overflow-hidden overflow-y-scroll'>
            {currentEmployees.length > 0 &&
              <div className='employee-details-container'>
                <div className='employee-heading'>Current employees</div>
                {currentEmployees.map(data =>
                  <div key={data.id} className='employee-details' onClick={() => handleEdit(data)}>
                    <b>{data.name}</b>
                    <span className='text-role'>{data.role}</span>
                    <span className='text-role'>From {data.from}</span>
                  </div>
                )}
              </div>
            }
            {previousEmployees.length > 0 &&
              <div className='employee-details-container'>
                <div className='employee-heading'>Previous employees</div>
                {previousEmployees.map(data =>
                  <div key={data.id} className='employee-details' onClick={() => handleEdit(data)}>
                    <b>{data.name}</b>
                    <span className='text-role'>{data.role}</span>
                    <span className='text-role'>From {data.from} - {data.to}</span>
                  </div>
                )}
              </div>
            }
          </div> :
          <div className='flex flex-col justify-start items-start w-full h-full gap-y-4 py-4 px-2'>
            <div className="label-parent">
              <input placeholder='Employee name' className='label-input' value={name} onChange={(e) => setName(e.target.value)} />
              <img src={employee} alt=" " className='label-img' />
            </div>
            <div className="label-parent" onClick={() => setShowRoles(!showRoles)}>
              <div className={`label-input flex items-center ${!role && "text-gray"}`}>{role === "" ? "Select role" : role}</div>
              <img src={roleI} alt=" " className='label-img' />
              <img src={dropdown} alt=" " className='absolute top-[0.5rem] right-2' />
            </div>
            <div className='flex flex-row justify-between text-[13px] label-parent'>
              <div className='w-[45%] relative' onClick={() => handleFromDate(1)}>
                <input placeholder='From' className='duration' value={from} />
                <img src={duration} alt=" " className='label-img' />
              </div>
              <div className='w-[10%] flex justify-center items-center'>
                <img src={arrow} alt="->" height="20px" width="20px" />
              </div>
              <div className='w-[45%] relative' onClick={() => handleFromDate(2)}>
                <input placeholder='To' className='duration' value={to} />
                <img src={duration} alt=" " className='label-img' />
              </div>
            </div>
          </div>
        }
        {!isEmployee ?
          <button className='absolute bottom-6 right-6 p-[16px] bg-blue text-white rounded-xl' onClick={addEmployee}>
            <img src={plus} alt="+" height="24px" width="24px" />
          </button> :
          <>
            {(isFrom || isTo) &&
              <div className='h-fit w-[90%] absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-blue p-4 flex flex-col justify-between gap-y-2 z-10'>
                {isFrom && <><div className='flex w-full justify-between items-center'>
                  <button className='btn w-[48%]' onClick={selectToday}>Today</button>
                  <button className='btn w-[48%]' onClick={() => goToMonday(1)}>Next Monday</button>
                </div>
                  <div className='flex w-full justify-between items-center'>
                    <button className='btn w-[48%]' onClick={() => goToMonday(2)}>Next Tuesday</button>
                    <button className='btn w-[48%]' onClick={afterOneWeek}>After 1 week</button>
                  </div></>}
                {isTo && <>
                  <div className='flex w-full justify-between items-center'>
                    <button className='btn w-[48%]' onClick={() => setSelectedDate('No Date')}>No Date</button>
                    <button className='btn w-[48%]' onClick={selectToday}>Today</button>
                  </div></>}
                <div className='flex w-full flex-col gap-y-2 justify-center items-center'>
                  <div className='flex w-full gap-x-2 justify-center items-center'>
                    <img src={left} alt="<" onClick={decreaseMonth} />
                    <b className='text-white' id="month-year">{monthNames[month]} {year}</b>
                    <img src={right} alt=">" onClick={increaseMonth} />
                  </div>
                  <div className='calendar-days'>
                    {generateCalendar(month, year)}
                  </div>
                </div>
                <div className='flex justify-between items-center px-2 w-full'>
                  <div className='flex items-center text-white w-full'>
                    <img src={duration} alt=" " />
                    <span>{selectedDate}</span>
                  </div>
                  <div className='flex justify-end items-center gap-x-3 w-full'>
                    <button className="bg-transparent text-lightBlue border-2 border-lightBlue font-bold px-2 py-1 rounded-md" onClick={cancelDate}>Cancel</button>
                    <button className="btn" onClick={saveDate}>Save</button>
                  </div>
                </div>
              </div>
            }
            <div className='border-t-2 border-borderTop flex justify-end items-center gap-x-3 p-4 w-full fixed bottom-0'>
              <button className="bg-lightBlue text-blue font-bold px-4 py-2 rounded-md" onClick={cancel}>Cancel</button>
              <button className="text-white bg-blue font-bold px-4 py-2 rounded-md" onClick={save}>Save</button>
            </div>
            {showRoles &&
              <div className='h-fit w-full flex flex-col items-center justify-center bg-fade z-10 rounded-t-3xl animate-slide'>
                {roles.map(role =>
                  <div className='border-b-2 border-lightBlue w-full flex justify-center' key={role.id}>
                    <li className="list-none p-4 " onClick={() => handleRole(role.id)}>
                      {role.name}
                    </li>
                  </div>)}
              </div>
            }
          </>
        }
      </div>
    </div>
  );
}

export default App;
