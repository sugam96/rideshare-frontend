import React, { useState, useEffect } from "react";
import { NavBar } from './NavBar';
import axios from 'axios';
import moment from "moment";

export const UserProfile = (props) => {

    const initialValues = { firstname: "", lastname: "", email: "", password: "", phone: "", dob: "", gender: "" };
    const [initialised, setInitialised] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [startValidating, setStartValidating] = useState(false);
    const [isSubmit, setIsSubmit] = useState(false);
    const [isValidated, setIsValidated] = useState(false);
    const [showSuccessScreen, setShowSuccessScreen] = useState(false);
    const [isEmailValidated, setIsEmailValidated] = useState(false)

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormValues({ ...formValues, [id]: value });
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        setStartValidating(true)
        setFormErrors(validate(formValues));
        console.log("Submit")
        // if (Object.keys(formErrors).length === 0 && isFirstValidated)
        //     setIsFirstSubmit(true);
    }

    async function initializer() {
        //axios
        console.log('Initializing');
        const user = await axios.get(`http://localhost:3050/user/${props.user.user_id}`, { params: { user_id: props.user.user_id } }).then((res) => {
            if (res.data.status)
                return res.data.data;
            else
                return 0;
        })
            .catch(function (error) {
                return 0;
            })
        if (user) {
            setFormValues({ firstname: user.first_name, lastname: user.last_name, email: user.email_id, password: "", phone: user.contact_number, dob: moment(user.date_of_birth).utc().format('YYYY-MM-DD'), gender: user.gender });
            setUserEmail(user.email_id);
        }
        setInitialised(true);
    }

    async function emailNotExists(email) {
        console.log("Email Check");
        const resp = await axios.post(`http://localhost:3050/UserEmailCheck`, { email_id: email }).then((res) => {
            if (!res.data.exists)
                return 1;
            else
                if (email === userEmail)
                    return 1;
                else
                    return 0;
        })
            .catch(function (error) {
                return 0;
            })
        if (resp === 0)
            setFormErrors({ ...formErrors, email: 'Email Already Registered' });
        else
            setIsEmailValidated(true)
    };
    async function updateUser() {
        if (isSubmit) {
            setIsSubmit(false);
            const resp = await axios.put(`http://localhost:3050/UserUpdate/${props.user.user_id}`, {
                first_name: formValues.firstname,
                last_name: formValues.lastname,
                date_of_birth: formValues.dob,
                gender: formValues.gender,
                contact_number: formValues.phone,
                email_id: formValues.email,
                password: formValues.password
            }).then((res) => {
                console.log(res.data);
                if (res.data.status)
                    console.log("Success");
                else
                    setFormErrors({ ...formErrors, server: res.data.message });
            })
                .catch(function (error) {
                    console.log("Error");
                })
            setFormValues({ ...formValues, password: "" });
        }
    }

    useEffect(() => {
        if (!initialised)
            initializer();
        if (startValidating && !isValidated) {
            console.log("Hello0");
            setFormErrors(validate(formValues));
            setStartValidating(false);
        }
        if (isValidated && Object.keys(formErrors).length === 0 && !isSubmit && isEmailValidated) {
            setIsValidated(false);
            setIsSubmit(true);
        }
        if (isSubmit) {
            console.log("Calling Update");
            setIsSubmit(false);
            updateUser();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formErrors, formValues, startValidating, isValidated, isEmailValidated]);


    const validate = (values) => {
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
        console.log(Object.keys(formErrors).length === 0);
        if (Object.keys(errors).length === 0)
            setIsValidated(true);
        console.log(isValidated);
        console.log("Validations");
        return errors;
    }


    return (
        <div><NavBar user={props.user}/>
            <div className="container-fluid text-center">
                <div className="row m-1">
                    <div className="col col-lg-3 border border-1">
                        Column
                    </div>
                    <div className="col col-lg-6">
                        <form className='h-100 p-4' onSubmit={handleSubmit}>
                            <h1 className="h3 mb-4 fw-normal">Update Profile</h1>
                            <p className="alert alert-danger p-0 border-0">
                                {formErrors.server}
                            </p>
                            <div className="form-floating">
                                <input type="text" className="form-control" id="firstname" placeholder="Sugam" value={formValues.firstname} onChange={handleChange} />
                                <label htmlFor="floatingInput">First Name</label>
                                <p className="text-danger text-start">
                                    {formErrors.firstname}
                                </p>
                            </div>
                            <div className="form-floating">
                                <input type="text" className="form-control" id="lastname" placeholder="Sharma" value={formValues.lastname} onChange={handleChange} />
                                <label htmlFor="floatingInput">Last Name</label>
                                <p className="text-danger text-start">
                                    {formErrors.lastname}
                                </p>
                            </div>
                            <div className="form-floating">
                                <input type="email" className="form-control" id="email" placeholder="name@example.com" value={formValues.email} onChange={handleChange} />
                                <label htmlFor="floatingInput">Email Address</label>
                                <p className="text-danger text-start">
                                    {formErrors.email}
                                </p>
                            </div>
                            <div className="form-floating">
                                <input type="tel" className="form-control " id="phone" placeholder="XXX-XXXXXXX" value={formValues.phone} onChange={handleChange} />
                                <label htmlFor="floatingInput">Phone Number</label>
                                <p className="text-danger text-start">
                                    {formErrors.phone}
                                </p>
                            </div>
                            <div className="input-group mb-3">
                                <label className="input-group-text " >Date of Birth</label>
                                <input type="date" className="form-control " id="dob" placeholder="XXX-XXXXXXX" value={formValues.dob} onChange={handleChange} />
                                <br></br>
                                <p className="text-danger text-start">
                                    {formErrors.dob}
                                </p>
                            </div>
                            <div className="input-group mb-3">
                                <label className="input-group-text " htmlFor="inputGroupSelect01">Gender</label>
                                <select className="form-control  col-9" id="gender" onChange={handleChange} value={formValues.gender}>
                                    <option defaultValue>Choose...</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                <p className="text-danger text-start">
                                    {formErrors.gender}
                                </p>
                            </div>
                            <div className="mt-4 text-start"><h6>Enter Password to Update</h6></div>
                            <div className="d-flex">
                                <div className="form-floating flex-fill m-1">
                                    <input type="password" className="form-control" id="password" placeholder="Enter Password to Update" value={formValues.password} onChange={handleChange} />
                                    <label htmlFor="floatingPassword">Password</label>
                                    <p className="text-danger text-start">
                                        {formErrors.password}
                                    </p>
                                </div>
                                <div className="p-1">
                                    <button className="btn btn-lg btn-primary m-1" type="submit">Update</button>
                                </div>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
