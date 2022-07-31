import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios';

export const UserSignUp = () => {
    let navigate = useNavigate();
    const initialValues = { firstname: "", lastname: "", email: "", password: "", checkbox: false, phone: "", dob: "", gender: "" };
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [startValidatingFirst, setStartValidatingFirst] = useState(false);
    const [startValidatingSecond, setStartValidatingSecond] = useState(false);
    const [isFirstSubmit, setIsFirstSubmit] = useState(false);
    const [isSecondSubmit, setIsSecondSubmit] = useState(false);
    const [isFirstValidated, setIsFirstValidated] = useState(false);
    const [isSecondValidated, setIsSecondValidated] = useState(false);
    const [showSuccessScreen, setShowSuccessScreen] = useState(false);
    const handleChange = (e) => {
        const { id, value } = e.target;
        if (id === "checkbox") {
            if (e.target.checked)
                setFormValues({ ...formValues, [id]: true });
            else
                setFormValues({ ...formValues, [id]: false });
        }
        else
            setFormValues({ ...formValues, [id]: value });
    }
    const handleFirstSubmit = (e) => {
        e.preventDefault();
        setStartValidatingFirst(true)

        setFormErrors(validateFirst(formValues));
        // console.log(formErrors)
        // if (Object.keys(formErrors).length === 0 && isFirstValidated)
        //     setIsFirstSubmit(true);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        setStartValidatingSecond(true);
        setFormErrors(validateSecond(formValues));
        // console.log(formErrors)
        // if (Object.keys(formErrors).length === 0 && isFirstValidated)
        //     setIsSecondSubmit(true);
    }
    const goBack = (e) => {
        e.preventDefault();
        setIsFirstSubmit(false);
        setIsSecondSubmit(false);
        setShowSuccessScreen(false);
    }
    async function emailNotExists(email) {
        const resp = await axios.post(`http://localhost:3050/UserEmailCheck`, { email_id: email }).then((res) => {
            if (!res.data.exists)
                return 1;
            else
                return 0;
        })
            .catch(function (error) {
                return 0;
            })
        if (resp === 0)
            setFormErrors({ ...formErrors, email: 'Email Already Registered' });
    };
    async function createUser() {
        const resp = await axios.post(`http://localhost:3050/UserCreate`, {
            first_name: formValues.firstname,
            last_name: formValues.lastname,
            date_of_birth: formValues.dob,
            gender: formValues.gender,
            contact_number: formValues.phone,
            email_id: formValues.email,
            password: formValues.password
        }).then((res) => {
            if (res.status === 200)
                return 1;
            else
                return 0;
        })
            .catch(function (error) {
                return 0;
            })
        if (resp === 0) {
            setIsSecondSubmit(false);
            setFormErrors({ ...formErrors, server: 'Something Went Wrong, Account Not Created. Please Try Again!' });
        }
        else {
            setShowSuccessScreen(true);
            redirector();
        }
    }
    const redirector = () => {
        let timer = setTimeout(()=>{navigate("/UserLogin")}, 10000);
        clearTimeout(timer);
        timer = setTimeout(()=>{navigate("/UserLogin")}, 5000);
    }
    useEffect(() => {
        if (startValidatingFirst && !isFirstValidated) {
            setFormErrors(validateFirst(formValues));
            setStartValidatingFirst(false);
        }
        if (isFirstValidated && Object.keys(formErrors).length === 0 && !isFirstSubmit) {
            setIsFirstValidated(false);
            setIsFirstSubmit(true);
        }
        //console.log(startValidatingSecond, !isSecondValidated);
        if (startValidatingSecond) {
            setFormErrors(validateSecond(formValues));
            setStartValidatingSecond(false);
        }
        if (startValidatingSecond && isSecondValidated && Object.keys(formErrors).length === 0 && !isSecondSubmit) {
            setIsSecondValidated(false);
            setIsSecondSubmit(true);
        }
        if (isFirstSubmit && isSecondSubmit) {
            createUser()
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formErrors]);


    const validateFirst = (values) => {
        const errors = {};
        const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/i;
        if (!values.firstname)
            errors.firstname = "First Name is Required!"
        if (!values.lastname)
            errors.lastname = "Last Name is Required!"
        if (!values.email)
            errors.email = "Email is Required!"
        else if (!emailRegex.test(values.email))
            errors.email = "Invalid Email!"
        else
            emailNotExists(values.email)
        if (!values.password)
            errors.password = "Password is Required!"
        else if (values.password.length < 6)
            errors.password = "Password should contain atleast 6 Characters"
        else if (values.password.length > 32)
            errors.password = "Password should cannot have more than 32 Characters"
        if (!values.checkbox)
            errors.checkbox = "Please Accept the Terms and Conditions"
        setIsFirstValidated(true);
        return errors;
    }
    const validateSecond = (values) => {
        const errors = {};
        if (!values.phone)
            errors.phone = "Phone Number is Required!"
        else if (values.phone.length !== 10)
            errors.phone = "Phone Number should be of 10 Digits"
        if (!values.dob)
            errors.dob = "Date of Birth is Required!"
        if (!values.gender)
            errors.gender = "Cannot be empty!"
        else if (values.gender === "Choose...")
            errors.gender = "Choose a Value!"
        setIsSecondValidated(true);
        return errors;
    }

    return (
        <div>
            {!isFirstSubmit && (<div className='container formsContainer'>
                <form className='h-100 p-4 text-light' onSubmit={handleFirstSubmit}>
                    <h1 className="h3 mb-4 fw-normal">Register With Us!</h1>
                    <div className="form-floating">
                        <input type="text" className="form-control text-light bg-dark" id="firstname" placeholder="Sugam" value={formValues.firstname} onChange={handleChange} />
                        <label htmlFor="floatingInput">First Name</label>
                        <p className="text-warning text-start">
                            {formErrors.firstname}
                        </p>
                    </div>

                    <div className="form-floating">
                        <input type="text" className="form-control text-light bg-dark" id="lastname" placeholder="Sharma" value={formValues.lastname} onChange={handleChange} />
                        <label htmlFor="floatingInput">Last Name</label>
                        <p className="text-warning text-start">
                            {formErrors.lastname}
                        </p>
                    </div>
                    <div className="form-floating">
                        <input type="email" className="form-control text-light bg-dark" id="email" placeholder="name@example.com" value={formValues.email} onChange={handleChange} />
                        <label htmlFor="floatingInput">Email Address</label>
                        <p className="text-warning text-start">
                            {formErrors.email}
                        </p>
                    </div>
                    <div className="form-floating ">
                        <input type="password" className="form-control text-light bg-dark" id="password" placeholder="Password" value={formValues.password} onChange={handleChange} />
                        <label htmlFor="floatingPassword">Password</label>
                        <p className="text-warning text-start">
                            {formErrors.password}
                        </p>
                    </div>

                    <div className="checkbox mb-3">
                        <label>
                            <input type="checkbox" id='checkbox' value={formValues.checkbox} onChange={handleChange} /> I Agree with the Terms and Conditions
                        </label>
                        <p className="text-warning text-start">
                            {formErrors.checkbox}
                        </p>
                    </div>
                    <button className="w-100 btn btn-lg btn-primary mb-4" type="submit">Sign Up</button>
                    <p>Already have an account? Click to <Link to="/UserLogin" className='text-light'>Log In</Link></p>
                </form>
            </div>)}

            {isFirstSubmit && !isSecondSubmit && (<div className='container formsContainer'>
                <form className='h-100 p-4 text-light' onSubmit={handleSubmit}>
                    <h1 className="h3 mb-4 fw-normal">A Few More Details</h1>
                    <p className="alert alert-danger p-0 border-0">
                        {formErrors.server}
                    </p>
                    <div className="form-floating">
                        <input type="tel" className="form-control text-light bg-dark" id="phone" placeholder="XXX-XXXXXXX" value={formValues.phone} onChange={handleChange} />
                        <label htmlFor="floatingInput">Phone Number</label>
                        <p className="text-warning text-start">
                            {formErrors.phone}
                        </p>
                    </div>
                    <div className="input-group mb-3">
                        <label className="input-group-text bg-dark text-light" >Date of Birth</label>
                        <input type="date" className="form-control text-light bg-dark" id="dob" placeholder="XXX-XXXXXXX" value={formValues.dob} onChange={handleChange} />
                        <br></br>
                        <p className="text-warning text-start">
                            {formErrors.dob}
                        </p>
                    </div>
                    <div className="input-group mb-3">
                        <label className="input-group-text bg-dark text-light" htmlFor="inputGroupSelect01">Gender</label>
                        <select className="form-control bg-dark text-light col-9" id="gender" onChange={handleChange} value={formValues.gender}>
                            <option defaultValue>Choose...</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                        <p className="text-warning text-start">
                            {formErrors.gender}
                        </p>

                    </div>

                    <div className='d-flex justify-content-between'>
                        <button className="btn btn-lg btn-secondary mb-4" onClick={goBack}>Back</button>
                        <button className="btn btn-lg btn-primary mb-4" type="submit">Sign Up</button>
                    </div>
                </form>
            </div>)}

            {showSuccessScreen && (<div className='container formsContainer text-light'>
                <h1 className="h3 mb-4 fw-normal">Welcome on Board!</h1>
                <p>A verfication Email has been sent to your Email Address. Please Verify Your Account.</p>
                <p>You Will be redirected to <Link to="/UserLogin" className='text-light'>Log In</Link> page in a moment.</p>
            </div>)}
        </div>
    )
}
