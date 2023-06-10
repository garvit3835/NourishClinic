import React, {useState, useEffect} from 'react'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'

interface FormErrors {
  name?: string
  email?: string
  mobileNum?: string
  alternateNum?: string
  countryCode?: string
}

export default function CreateAppointment(props: any) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [clientType, setClientType] = useState('')
  const [appointmentFor, setAppointmentFor] = useState('')
  const [countryCode, setCountryCode] = useState<any>('')
  const [mobileNum, setMobileNum] = useState<any>('')
  const [alternateNum, setAlternateNum] = useState<any>('')
  const [paymentAmount, setPaymentAmount] = useState(5000)
  const [date, setDate] = useState<any>(props.timeSlot ? props.timeSlot : null)
  const [time, setTime] = useState<any>()
  const [clientId, setClientId] = useState<any>()
  const [errors, setErrors] = useState<FormErrors>({})
  let testDate = new Date('2023-05-23T10:00')

  const nextSlot = (date: Date) => {
    date.setMinutes(date.getMinutes() + 15)
    return date
  }
  // console.log(date)
  // console.log(time)
  // console.log(new Date(`${date} ${time}`))

  useEffect(() => {
    if (props.appointmentId) {
      console.log(props.appointmentId)
      axios
        .get(`http://localhost:5000/api/appointments/appointment_by_id/${props.appointmentId}`)
        .then((res) => {
          console.log(res.data)
          setClientId(res.data.clientId)
          setName(res.data.name)
          setEmail(res.data.email)
          setMobileNum(res.data.mobile)
          setAlternateNum(res.data.alternateNum)
          setCountryCode(res.data.countryCode)
          setAppointmentFor(res.data.appointmentFor)
          setClientType(res.data.clientType)
        })
    }
  }, [])

  const validateName = (value: string) => {
    if (!value.trim()) {
      return 'Name is required'
    }
    return ''
  }

  const validateEmail = (value: string) => {
    if (!value.trim()) {
      return 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      return 'Email is invalid'
    }
    return ''
  }

  const validatemobileNum = (value: number | '') => {
    if (!value) {
      return 'Phone number is required'
    } else if (!/^\d{7,15}$/.test(String(value))) {
      return 'Phone number must have 7 to 15 digits'
    }
    return ''
  }
  const validatealternateNum = (value: number | '') => {
    if (!value) {
      return 'Phone number is required'
    } else if (!/^\d{7,15}$/.test(String(value))) {
      return 'Phone number must have 7 to 15 digits'
    }
    return ''
  }
  const validatecountryCode = (value: number | '') => {
    if (!value) {
      return 'Country phone code is required'
    } else if (!/^\d{1,5}$/.test(String(value))) {
      return 'Country phone code must have 1 to 5 digits'
    }
    return ''
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target
    setName(value)
    setErrors((prevErrors) => ({...prevErrors, name: validateName(value)}))
  }

  const handleEmailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target
    if (value !== '') {
      const res = await axios.get(`http://localhost:5000/api/clients/client_by_email/${value}`)
      console.log(res.data)
      if (res.data) {
        setName(res.data.name)
        setClientId(res.data._id)
        setMobileNum(res.data.mobile)
        setAlternateNum(res.data.alternateNum)
        setCountryCode(res.data.countryCode)
      } else {
        setClientId(null)
        setMobileNum(null)
        setAlternateNum(null)
      }
    }
    setEmail(value)
    setErrors((prevErrors) => ({...prevErrors, email: validateEmail(value)}))
  }

  const handlemobileNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target
    const mobileNum = value ? parseInt(value, 10) : ''
    setMobileNum(mobileNum)
    setErrors((prevErrors) => ({...prevErrors, mobileNum: validatemobileNum(mobileNum)}))
  }
  const handlealternateNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target
    const alternateNum = value ? parseInt(value, 10) : ''
    setAlternateNum(alternateNum)
    setErrors((prevErrors) => ({...prevErrors, alternateNum: validatealternateNum(alternateNum)}))
  }
  const handlecountryCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target
    const countryCode = value ? parseInt(value, 10) : ''
    setCountryCode(countryCode)
    setErrors((prevErrors) => ({...prevErrors, countryCode: validatecountryCode(countryCode)}))
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    const nameError = validateName(name)
    const emailError = validateEmail(email)
    const mobileNumError = validatemobileNum(mobileNum)
    const alternateNumError = validatealternateNum(mobileNum)
    const countryCodeError = validatecountryCode(countryCode)

    if (nameError || emailError || mobileNumError || alternateNumError || countryCodeError) {
      setErrors({
        name: nameError,
        email: emailError,
        mobileNum: mobileNumError,
        alternateNum: alternateNumError,
        countryCode: countryCodeError,
      })
      return
    }
    if (!clientId) {
      toast.error('No client registered with the entered email', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      })
      return
    }

    if (props.appointmentId) {
      const res: any = await axios.put(
        `http://localhost:5000/api/appointments/update/${new Date()}/${props.appointmentId}`,
        {
          timeSlot: new Date(`${date} ${time}`),
        }
      )
      if (res) {
        toast.success('Appointment successfully updated', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        })
        props.setCalendarModalShow(false)
      }
    } else {
      const res = await fetch('http://localhost:5000/api/appointments/create', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          clientId,
          timeSlot: new Date(`${date} ${time}`),
          clientType,
          appointmentFor,
          paymentAmount,
          month: props.month,
          year: props.year,
        }),
      })
      console.log(res.json())
      // props.setAppointments(res)
      if (res) {
        toast.success('Appointment successfully created', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        })
      }
    }

    // setTimeout(() => {
    props.setModalShow(false)
    // }, 3000)
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className='form-group my-5'>
          <div className='md:w-1/3'>
            <label
              className='fs-3'
              // className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'
              htmlFor='inline-full-name'
            >
              Name
            </label>
          </div>
          <div className='md:w-2/3'>
            <input
              className='form-control'
              id='inline-full-name'
              type='text'
              placeholder='Jane Doe'
              value={name}
              onChange={handleNameChange}
            />
            {errors.name && <span className='error text-danger'>{errors.name}</span>}
          </div>
        </div>
        <div className='form-group my-5'>
          <div className='md:w-1/3'>
            <label
              className='fs-3'
              // className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'
              htmlFor='inline-full-name'
            >
              Email
            </label>
          </div>
          <div className='md:w-2/3'>
            <input
              className='form-control'
              id='inline-full-name'
              type='text'
              placeholder='janedoe@gmail.com'
              value={email}
              onChange={handleEmailChange}
            />
            {errors.email && <span className='error text-danger'>{errors.email}</span>}
          </div>
        </div>
        <div className='form-group my-5'>
          <div className='md:w-1/3'>
            <label
              className='fs-3'
              // className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'
              htmlFor='inline-full-name'
            >
              Country Code
            </label>
          </div>
          <div className='md:w-2/3'>
            <input
              className='form-control'
              id='inline-full-name'
              type='number'
              value={countryCode}
              onChange={handlecountryCodeChange}
            />
            {errors.countryCode && <span className='error text-danger'>{errors.countryCode}</span>}
          </div>
        </div>
        <div className='form-group my-5'>
          <div className='md:w-1/3'>
            <label className='fs-3' htmlFor='inline-full-name'>
              Mobile No.
            </label>
          </div>
          <div className='md:w-2/3'>
            <input
              className='form-control'
              id='inline-full-name'
              type='number'
              value={mobileNum}
              onChange={handlemobileNumChange}
            />
            {errors.mobileNum && <span className='error text-danger'>{errors.mobileNum}</span>}
          </div>
        </div>
        <div className='form-group my-5'>
          <div className='md:w-1/3'>
            <label
              className='fs-3'
              // className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'
              htmlFor='inline-full-name'
            >
              Alternate No.
            </label>
          </div>
          <div className='md:w-2/3'>
            <input
              className='form-control'
              id='inline-full-name'
              type='number'
              value={alternateNum}
              onChange={handlealternateNumChange}
            />
            {errors.alternateNum && (
              <span className='error text-danger'>{errors.alternateNum}</span>
            )}
          </div>
        </div>
        <div className='form-group my-5'>
          <div className='md:w-1/3'>
            <label
              className='fs-3'
              // className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'
              htmlFor='inline-full-name'
            >
              Client Type
            </label>
          </div>
          <div className='relative md:w-2/3'>
            <select
              className='form-control'
              id='grid-state'
              value={clientType}
              onChange={(e) => setClientType(e.target.value)}
            >
              <option value=''>---Select---</option>
              <option value='new-reg'>New Reg</option>
              <option value='re-reg'>Re Reg</option>
              <option value='dc'>DC</option>
              <option value='faceT'>Face T</option>
            </select>
          </div>
        </div>
        <div className='form-group my-5'>
          <div className='md:w-1/3'>
            <label
              className='fs-3'
              // className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'
              htmlFor='inline-full-name'
            >
              Appointment For
            </label>
          </div>
          <div className='relative md:w-2/3'>
            <select
              className='form-control'
              id='grid-state'
              value={appointmentFor}
              onChange={(e) => setAppointmentFor(e.target.value)}
            >
              <option value=''>---Select---</option>
              <option value='celib'>Celib</option>
              <option value='celib+pvt'>Celib + pvt</option>
              <option value='normal'>Normal</option>
              <option value='noraml+pvt'>Normal + pvt</option>
              <option value='vip'>VIP</option>
            </select>
          </div>
        </div>
        <div className='form-group my-5'>
          <div className='md:w-1/3'>
            <label className='fs-3' htmlFor='date'>
              Date
            </label>
          </div>
          <div className='md:w-2/3'>
            <input
              className='form-control'
              id='date'
              type='date'
              defaultValue={date}
              // value={timeSlot}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>
        <div className='form-group my-5'>
          <div className='md:w-1/3'>
            <label
              className='fs-3'
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
              placeholder='Jane Doe'
              // value={timeSlot}
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
        <div className='form-group my-5'>
          <div className='md:w-1/3'>
            <label
              className='fs-3'
              // className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'
              htmlFor='inline-full-name'
            >
              Amount
            </label>
          </div>
          <div className='md:w-2/3'>
            <input
              className='form-control'
              id='inline-full-name'
              type='number'
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.valueAsNumber)}
            />
          </div>
        </div>
        <button type='submit' className='btn btn-primary'>
          Submit
        </button>
      </form>
    </>
  )
}
