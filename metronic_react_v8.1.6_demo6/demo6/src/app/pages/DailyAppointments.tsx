import {useEffect, useState} from 'react'
import {Modal} from 'react-bootstrap'
import axios from 'axios'
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd'
import Calender from './Calender'

export default function DailyAppointments() {
  const [appointments, setAppointments] = useState([])
  const [id, setId] = useState()
  const [modalShow, setModalShow] = useState(false)
  const [modalShow2, setModalShow2] = useState(false)
  // const [modalShow3, setModalShow3] = useState(false)
  const [date, setDate] = useState<any>()
  const [description, setDescription] = useState<any>()
  const [payStatus, setPayStatus] = useState<any>()
  const [dailyDate, setDailyDate] = useState<any>(new Date().toISOString().split('T')[0])
  const [time, setTime] = useState<any>()
  const [timerValues, setTimerValues] = useState<any>({})
  const [isRunning, setIsRunning] = useState<any>({})
  let testDate = new Date('2023-05-23T10:00')

  const nextSlot = (date: Date) => {
    date.setMinutes(date.getMinutes() + 15)
    return date
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    const res: any = await axios.put(
      `http://localhost:5000/api/appointments/update/${dailyDate}/${id}`,
      {
        timeSlot: new Date(`${date} ${time}`),
      }
    )
    setAppointments(res.data)
    setModalShow(false)
  }
  const handleUpdate = async (event: any) => {
    event.preventDefault()
    const res: any = await axios.put(
      `http://localhost:5000/api/appointments/update/${dailyDate}/${id}`,
      {
        description,
        payStatus,
      }
    )
    setAppointments(res.data)
    setModalShow(false)
  }

  const handleAppointmentStatus = async (id: any, status: string) => {
    const res = await axios.put(
      `http://localhost:5000/api/appointments/update/${dailyDate}/${id}`,
      {
        status,
      }
    )

    setAppointments(res.data)
  }

  useEffect(() => {
    const initialTimerValues: any = {}
    const initialIsRunning: any = {}

    // Initialize timer values and running status for each appointment
    appointments.forEach((appointment: any) => {
      initialTimerValues[appointment.id] = appointment.duration
      initialIsRunning[appointment.id] = false
    })

    setTimerValues(initialTimerValues)
    setIsRunning(initialIsRunning)
  }, [appointments])

  useEffect(() => {
    const timers: any = {}

    // Start timers for each appointment
    Object.keys(isRunning).forEach((id) => {
      if (isRunning[id]) {
        timers[id] = setInterval(() => {
          setTimerValues((prevValues: any) => ({
            ...prevValues,
            [id]: prevValues[id] + 1,
          }))
        }, 60000)
      }
    })

    // Clear timers when stopped or component unmounts
    return () => {
      Object.values(timers).forEach((timer: any) => {
        clearInterval(timer)
      })
    }
  }, [isRunning])

  const handleStart = async (id: any) => {
    setIsRunning((prevRunning: any) => ({
      ...prevRunning,
      [id]: true,
    }))
  }

  const handleStop = async (id: any, duration: number) => {
    setIsRunning((prevRunning: any) => ({
      ...prevRunning,
      [id]: false,
    }))
    await axios.put(`http://localhost:5000/api/appointments/update/${dailyDate}/${id}`, {
      duration,
    })
  }

  const handlePrintBill = async (name : string, payStatus: string, date: any, timeSlot: any, amount: any) => {
    const params: URLSearchParams = new URLSearchParams();
    params.append('name', name);
    params.append('payStatus', payStatus);
    params.append('date', date);
    params.append('timeSlot', timeSlot);
    params.append('amount', amount);

    const url = `bill?${params.toString()}`;
    window.open(url, '_blank');
  }

  

  useEffect(() => {
    fetch(`http://localhost:5000/api/appointments/getDaily/${dailyDate}`)
      .then((res) => res.json())
      .then((data) => setAppointments(data))
  }, [modalShow, dailyDate])

  console.log(appointments)

  const deleteAppointment = async (id: string) => {
    const res: any = await axios.delete(
      `http://localhost:5000/api/appointments/delete/${dailyDate}/${id}`
    )
    setAppointments(res.data)
  }

  const handleDragEnd = (e: any) => {
    if (!e.destination) return
    let tempData = Array.from(appointments)
    let [source_data] = tempData.splice(e.source.index, 1)
    tempData.splice(e.destination.index, 0, source_data)
    setAppointments(tempData)
  }

  return (
    <>
      <div className='form-group my-5'>
        <div className='md:w-1/3'>
          <label className='fs-3' htmlFor='date'>
            Date
          </label>
        </div>
        <div className='w-1/3'>
          <input
            className='form-control w-1/3'
            id='date1'
            type='date'
            defaultValue={dailyDate}
            onChange={(e) => setDailyDate(e.target.value)}
          />
        </div>
      </div>
      <DragDropContext onDragEnd={(results) => handleDragEnd(results)}>
        <table className='table table-lg table-bordered w-100'>
          <thead>
            <tr>
              <th className='fs-3'>Report Status</th>
              <th className='fs-3'>Timeslot</th>
              <th className='fs-3'>Type</th>
              <th className='fs-3'>Name/Phone</th>
              <th className='fs-3'>Description</th>
              <th className='fs-3'>Status</th>
              <th className='fs-3'>Check-In/Out</th>
              <th className='fs-3'>Payment Status</th>
              <th className='fs-3'>Bill receipt</th>
              <th className='fs-3'>Update appointment</th>
            </tr>
          </thead>
          <Droppable droppableId='tbody'>
            {(provided) => (
              <tbody ref={provided.innerRef} {...provided.droppableProps}>
                {appointments &&
                  appointments.map((appointment: any, i) => {
                    return (
                      <Draggable draggableId={appointment.id} index={i} key={appointment.id}>
                        {(provided, snapshot) => (
                          <tr
                            className={`draggable-row ${snapshot.isDragging ? 'dragging' : ''}`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            // style={{ width: snapshot.isDragging ? 'auto' : '100%' }}
                            style={{
                              ...provided.draggableProps.style,
                              transition: 'background-color 0.2s ease',
                              backgroundColor: snapshot.isDragging ? 'lightblue' : 'white',
                            }}
                          >
                            <td className='fs-3 first-column' {...provided.dragHandleProps}>
                              {appointment.reportStatus}
                            </td>
                            <td className='fs-3 first-column'>{appointment.timeSlot}</td>
                            <td className='fs-3 first-column'>{appointment.clientType}</td>
                            <td className='fs-3 first-column'>
                              {appointment.name}
                              <br />
                              {appointment.phone}
                            </td>
                            <td className='fs-3 first-column'>{appointment.description}</td>
                            <td className=' first-column'>
                              {appointment.status ? (
                                <div className='d-flex justify-content-center align-items-center'>
                                  <div className='fs-3'>{appointment.status}</div>
                                </div>
                              ) : (
                                <>
                                  <button
                                    type='button'
                                    className='btn btn-success btn-sm py-0 w-100 fs-6'
                                    onClick={() => {
                                      handleAppointmentStatus(appointment.id, 'Confirmed')
                                    }}
                                  >
                                    Confirm
                                  </button>
                                  <br />
                                  <button
                                    type='button'
                                    className='btn btn-primary btn-sm py-0 w-100 fs-6 my-1'
                                    onClick={() => {
                                      setId(appointment.id)
                                      setModalShow(true)
                                    }}
                                  >
                                    Reschedule
                                  </button>
                                  <br />
                                  <button
                                    type='button'
                                    className='btn btn-danger btn-sm py-0 w-100 fs-6'
                                    onClick={() => deleteAppointment(appointment.id)}
                                  >
                                    Cancel
                                  </button>
                                </>
                              )}
                            </td>
                            <td className=' first-column'>
                              {isRunning[appointment.id] ? (
                                <button
                                  onClick={() =>
                                    handleStop(appointment.id, timerValues[appointment.id])
                                  }
                                  className='btn btn-danger btn-sm py-1 w-100'
                                >
                                  Check-Out
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleStart(appointment.id)}
                                  className='btn btn-primary btn-sm py-1 w-100'
                                >
                                  Check-In
                                </button>
                              )}
                              {/* <br/> */}
                              <p className='text-center m-0 pt-2 fs-4'>
                                {timerValues[appointment.id] !== 0 || isRunning[appointment.id]
                                  ? `${timerValues[appointment.id]} Min`
                                  : null}
                              </p>
                            </td>
                            <td className='fs-3 first-column'>{appointment.payStatus}</td>
                            <td className=' first-column'>
                              <button
                                type='button'
                                className='btn btn-primary px-12'
                                role='link'
                                onClick={() =>
                                  handlePrintBill(
                                    appointment.name,
                                    appointment.payStatus,
                                    dailyDate,
                                    appointment.timeSlot,
                                    appointment.amount
                                  )
                                }
                              >
                                Print
                              </button>
                            </td>
                            <td className=' first-column'>
                              <button
                                type='button'
                                className='btn btn-primary px-12'
                                onClick={() => {
                                  setId(appointment.id)
                                  setDescription(appointment.description)
                                  setPayStatus(appointment.payStatus)
                                  setModalShow2(true)
                                }}
                              >
                                Update
                              </button>
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    )
                  })}
                {provided.placeholder}
              </tbody>
            )}
          </Droppable>
        </table>
        <Modal show={modalShow} size='lg' aria-labelledby='contained-modal-title-vcenter' centered>
          <Modal.Body>
            {/* <form onSubmit={handleSubmit}>
              <div className='form-group my-5'>
                <div className='md:w-1/3'>
                  <label htmlFor='date'>Date</label>
                </div>
                <div className='md:w-2/3'>
                  <input
                    className='form-control'
                    id='date'
                    type='date'
                    defaultValue={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>
              <div className='form-group my-5'>
                <div className='md:w-1/3'>
                  <label
                    // className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'
                    htmlFor='time'
                  >
                    Time
                  </label>
                </div>
                <div className='md:w-2/3'>
                  <select
                    className='form-control'
                    id='time'
                    onChange={(e) => setTime(e.target.value)}
                  >
                    <option value=''>---Select---</option>
                    {[...Array(24)].map((_, i) => {
                      return (
                        <option
                          key={i}
                          value={testDate.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                          label={`${testDate.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })} - ${nextSlot(testDate).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}`}
                        />
                      )
                    })}
                  </select>
                </div>
              </div>
              <button
                id='update'
                type='submit'
                className='btn btn-primary btn-sm py-2 close'
                data-dismiss='modal'
                aria-label='Close'
                onClick={() => setModalShow(false)}
              >
                Confirm Update
              </button>
            </form> */}
            <Calender appointmentId={id} setCalendarModalShow={setModalShow} />
          </Modal.Body>
        </Modal>
        <Modal show={modalShow2} size='lg' aria-labelledby='contained-modal-title-vcenter' centered>
          <Modal.Body>
            <form onSubmit={handleUpdate}>
              <div className='form-group my-5'>
                <div className='md:w-1/3'>
                  <label className='fs-3' htmlFor='date'>
                    Description
                  </label>
                </div>
                <div className='md:w-2/3'>
                  <textarea
                    className='form-control'
                    id='exampleFormControlTextarea1'
                    rows={3}
                    defaultValue={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
              <div className='form-group my-5'>
                <div className='md:w-1/3'>
                  <label className='fs-3' htmlFor='inline-full-name'>
                    Payment Status
                  </label>
                </div>
                <div className='relative md:w-2/3'>
                  <select
                    className='form-control'
                    id='grid-state'
                    defaultValue={payStatus}
                    onChange={(e) => setPayStatus(e.target.value)}
                  >
                    <option value='Unpaid'>Unpaid</option>
                    <option value='Paid'>Paid</option>
                    <option value='Complementary'>Complementary</option>
                    <option value='Refund'>Refund</option>
                  </select>
                </div>
              </div>
              <button
                id='update'
                type='submit'
                className='btn btn-primary btn-sm py-2 close'
                data-dismiss='modal'
                aria-label='Close'
                onClick={() => setModalShow2(false)}
              >
                Confirm Update
              </button>
            </form>
          </Modal.Body>
        </Modal>
      </DragDropContext>
    </>
  )
}
