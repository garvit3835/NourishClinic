import React, {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {Modal} from 'react-bootstrap'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import CreateAppointment from './CreateAppointment'

export default function Calender(props: any) {
  const [appointments, setAppointments] = useState<any>()
  const [month, setMonth] = useState<any>(new Date().getMonth())
  const [year, setYear] = useState<any>(new Date().getFullYear())
  const [modalShow, setModalShow] = useState(false)
  const [timeSlot, setTimeSlot] = useState<any>()

  // const navigate = useNavigate()

  const handlelink = (event: any) => {
    event.stopPropagation()
  }

  console.log(appointments)

  useEffect(() => {
    fetch('http://localhost:5000/api/appointments/getAll', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({month: month + 1, year}),
    })
      .then((res) => res.json())
      .then((data) => setAppointments(data))
  }, [month, year])

  const handleHoliday = async (e: any, date: any, message: any) => {
    e.stopPropagation()
    const res = await fetch('http://localhost:5000/api/holidays/create', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({date: date, message: message}),
    })

    await fetch('http://localhost:5000/api/appointments/getAll', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({month: month + 1, year}),
    })
      .then((res) => res.json())
      .then((data) => setAppointments(data))
  }

  return (
    <>
      <button
        type='button'
        className='btn btn-primary px-12 mt-4'
        onClick={() => setModalShow(true)}
      >
        Add Appointment
      </button>

      <div className='mt-4'>
        <Calendar
          tileContent={({date, view}: any) => {
            let faceT = 0
            let NR = 0
            let RR = 0
            let DC = 0
            let Available = 15
            let appointmentMessage = null

            if (appointments) {
              appointments.forEach((appointment: any) => {
                const appointmentDate = new Date(appointment.date || appointment.timeSlot).getDate() // Get the date from the appointment

                if (date.getDate() === appointmentDate) {
                  // Compare with the current calendar date
                  // Update variables based on the appointment type
                  if (appointment.clientType === 'faceT') {
                    faceT++
                    Available--
                  } else if (appointment.clientType === 'new-reg') {
                    NR++
                    Available--
                  } else if (appointment.clientType === 're-reg') {
                    RR++
                    Available--
                  } else if (appointment.clientType === 'dc') {
                    DC++
                    Available--
                  }

                  if (appointment.message) {
                    appointmentMessage = appointment.message
                  }
                }
              })
            }

            return view === 'month' && date.getDay() !== 0 && date.getMonth() === month ? (
              <div className='text-xs'>
                <div className='dropdown fs-2 float-end'>
                  <a
                    className='dropdown-toggle text-gray-700'
                    type='button'
                    id='dropdownMenuButton'
                    data-bs-toggle='dropdown'
                    aria-haspopup='true'
                    aria-expanded='false'
                    onClick={handlelink}
                  ></a>
                  <div className='dropdown-menu' aria-labelledby='dropdownMenuButton'>
                    <a
                      className='dropdown-item'
                      href='#'
                      onClick={(event: any) => handleHoliday(event, date, 'Public holiday')}
                    >
                      Public Holiday
                    </a>
                    <a
                      className='dropdown-item'
                      href='#'
                      onClick={(event: any) => handleHoliday(event, date, 'Pooja on leave')}
                    >
                      Pooja on Leave
                    </a>
                  </div>
                  {/* Dropdown content */}
                </div>
                <br />
                
                  <>
                    {appointmentMessage && (
                      <div className='fs-2'>
                        <br />
                        {appointmentMessage}
                      </div>
                    )}
                    {!appointmentMessage && (
                      <>
                        <div>Face T = {faceT}</div>
                        <div>N + R = {NR}</div>
                        <div>Re-Reg = {RR}</div>
                        <div>DC = {DC}</div>
                        <div>Available = {Available}</div>
                      </>
                    )}
                  </>
        
              </div>
            ) : null

            // const calendarDate = date.getDate()
            // let faceT = 0
            // let NR = 0
            // let RR = 0
            // let DC = 0
            // let Available = 15
            // // if (appointments) {
            // //   appointments.forEach(appointment => {
            // //     const appointmentDate = new Date(appointment.date || appointment.timeSlot).getDate();

            // //     if (date.getDate() === appointmentDate) { // Compare with the current calendar date
            // //       // Rest of your logic for updating variables based on the appointment
            // //     }
            // //   });
            // // }
            // if (appointments) {
            //   for (let i = 0; i < appointments.length; i++) {
            //     if (appointments[i].date) {
            //       if (calendarDate === new Date(appointments[i].date).getDate()) {
            //         console.log(date.getDate())
            //         console.log(new Date(appointments[i].date).getDate())
            //         return view === 'month' && date.getDay() !== 0 && date.getMonth() === month ? (
            //           <div className='text-xs'>
            //             <div className='dropdown fs-2 float-end'>
            //               <a
            //                 className='dropdown-toggle text-gray-700'
            //                 type='button'
            //                 id='dropdownMenuButton'
            //                 data-bs-toggle='dropdown'
            //                 aria-haspopup='true'
            //                 aria-expanded='false'
            //                 onClick={handlelink}
            //               ></a>
            //               <div className='dropdown-menu' aria-labelledby='dropdownMenuButton'>
            //                 <a
            //                   className='dropdown-item'
            //                   href='#'
            //                   onClick={(event: any) => handleHoliday(event, date, 'Public holiday')}
            //                 >
            //                   Public Holiday
            //                 </a>
            //                 <a
            //                   className='dropdown-item'
            //                   href='#'
            //                   onClick={(event: any) => handleHoliday(event, date, 'Pooja on leave')}
            //                 >
            //                   Pooja on Leave
            //                 </a>
            //               </div>
            //             </div>
            //             <br />
            //             <div className='fs-2'>
            //               <br />
            //               {appointments[i].message}
            //             </div>
            //           </div>
            //         ) : null
            //       }
            //     } else if (appointments[i].timeSlot) {
            //       console.log(calendarDate)
            //       console.log(new Date(appointments[i].timeSlot).getDate())
            //       if (calendarDate === new Date(appointments[i].timeSlot).getDate()) {
            //         console.log('hwllo')
            //         // console.log(appointments[i].clientType)
            //         if (appointments[i].clientType === 'dc') {
            //           DC = DC + 1
            //           Available = Available - 1
            //         } else if (appointments[i].clientType === 're-reg') {
            //           RR = RR + 1
            //           Available = Available - 1
            //         } else if (appointments[i].clientType === 'faceT') {
            //           faceT = faceT + 1
            //           Available = Available - 1
            //         } else if (appointments[i].clientType === 'new-reg') {
            //           NR = NR + 1
            //           Available = Available - 1
            //         }
            //       }

            //       return view === 'month' && date.getDay() !== 0 && date.getMonth() === month ? (
            //         <div className='text-xs'>
            //           <div className='dropdown fs-2 float-end'>
            //             <a
            //               className='dropdown-toggle text-gray-700'
            //               type='button'
            //               id='dropdownMenuButton'
            //               data-bs-toggle='dropdown'
            //               aria-haspopup='true'
            //               aria-expanded='false'
            //               onClick={handlelink}
            //             ></a>
            //             <div className='dropdown-menu' aria-labelledby='dropdownMenuButton'>
            //               <a
            //                 className='dropdown-item'
            //                 href='#'
            //                 onClick={(event: any) => handleHoliday(event, date, 'Public holiday')}
            //               >
            //                 Public Holiday
            //               </a>
            //               <a
            //                 className='dropdown-item'
            //                 href='#'
            //                 onClick={(event: any) => handleHoliday(event, date, 'Pooja on leave')}
            //               >
            //                 Pooja on Leave
            //               </a>
            //             </div>
            //           </div>
            //           <br />
            //           <div>Face T = {faceT}</div>
            //           <div>N + R = {NR}</div>
            //           <div>Re-Reg = {RR}</div>
            //           <div>DC = {DC}</div>
            //           <div>Available = {Available}</div>
            //         </div>
            //       ) : null
            //     }
            //   }
            // }
          }}
          // tileDisabled={({ activeStartDate, date, view }) => view === "month"}
          onClickDay={async (value, event) => {
            value.setDate(value.getDate() + 1)
            setTimeSlot(value.toISOString().split('T')[0])
            setModalShow(true)

            // navigate('/createAppointment', {state: value.toISOString().split('T')[0]})
          }}
          tileDisabled={({activeStartDate, date, view}) => {
            let today = new Date()
            let stringToday = today.toDateString()
            let newToday = new Date(stringToday)
            return (
              view === 'month' &&
              (date < newToday || date.getDay() === 0 || date.getMonth() !== month)
              // ||
              // (appointments && appointments.map((appointment: any, index: number) => {}))
            )
          }}
          onActiveStartDateChange={({action, activeStartDate, value, view}) => {
            if (action === 'prev') {
              setMonth(month - 1)
            } else if (action === 'prev2') {
              setYear(year - 1)
            } else if (action === 'next') {
              setMonth(month + 1)
            } else if (action === 'next2') {
              setYear(year + 1)
            }
          }}
        />
      </div>

      <Modal show={modalShow} size='lg' aria-labelledby='contained-modal-title-vcenter' centered>
        <Modal.Header>
          <a type='button' className='text-black' onClick={() => setModalShow(false)}>
            <h3 className=''>&times;</h3>
          </a>
          {/* <Modal.Title>Title for Modal</Modal.Title> */}
        </Modal.Header>
        <Modal.Body>
          <CreateAppointment
            timeSlot={timeSlot}
            setModalShow={setModalShow}
            setAppointments={setAppointments}
            appointmentId={props.appointmentId}
            setCalendarModalShow={props.setCalendarModalShow}
            month={month}
            year={year}
          />
        </Modal.Body>
      </Modal>
    </>
  )
}
