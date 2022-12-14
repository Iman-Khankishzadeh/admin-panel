import React, { useEffect, useState } from 'react';
import {useLocation, useNavigate, useOutletContext} from 'react-router-dom'
import FormikControl from '../../components/form/FormikControl';
import ModalsContainer from '../../components/ModalsContainer';
import { initialValues, onSubmit, validationSchema } from './core';
import {Formik, Form} from 'formik'
import SubmitButton from '../../components/form/SubmitButton';
import { getAllRolesService, getSinglrUserService } from '../../services/users';
import { convertDateToJalali } from '../../utils/convertDate';

const AddUser = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const userId = location.state?.userId
    const {setData} = useOutletContext()

    const [userToEdit, setUserToEdit] = useState(null)
    const [allRoles, setAllRoles] = useState([])
    const [selectedRoles, setSelectedRoles]=useState([])
    const [reInitialValues, setReInitialValues]=useState(null)

    const handleGetAllRoles = async ()=>{
        const res = await getAllRolesService();
        if (res.status === 200) {
            setAllRoles(res.data.data.map(r=>{return{id:r.id, value:r.title}}));
        }
    }

    const handleGetUserData = async ()=>{
        const res = await getSinglrUserService(userId);
        if (res.status === 200) {
            setUserToEdit(res.data.data);
        }
    }

    useEffect(()=>{
        handleGetAllRoles()
        if (userId) {
            handleGetUserData()
        }
    },[])

    useEffect(()=>{
        if (userToEdit) {
            setSelectedRoles(userToEdit.roles.map(r=>{return {id:r.id, value:r.title}}))
            const roles_id = userToEdit.roles.map(p=>p.id);
            setReInitialValues({
                birth_date: userToEdit.birth_date ? convertDateToJalali(userToEdit.birth_date, 'jD / jM / jYYYY') : "",
                roles_id,
                password: "",
                user_name: userToEdit.user_name || "",
                first_name: userToEdit.first_name || "",
                last_name: userToEdit.last_name || "",
                phone: userToEdit.phone || "",
                email: userToEdit.email || "",
                gender: userToEdit.gender || 1,
                isEditing : true
            })
        }
    },[userToEdit])

    return (

        <ModalsContainer
            className="show d-block"
            id={"add_user_modal"}
            title={"???????????? ??????????"}
            fullScreen={true}
            closeFunction={()=>navigate(-1)}
        >
            <div className="container">
                <Formik
                initialValues={reInitialValues || initialValues}
                onSubmit={(values, actions)=>onSubmit(values, actions, setData, userId)}
                validationSchema={validationSchema}
                enableReinitialize
                >
                    {
                        formik=>{
                            return (
                                <Form className="row justify-content-center">
                                    <div className="row justify-content-center">
                                        <FormikControl
                                        className={"col-md-8"}
                                        control="input"
                                        type="text"
                                        name="user_name"
                                        label="?????? ????????????"
                                        placeholder="?????? ???? ???????? ?????????? ?? ?????????? ?????????????? ????????"
                                        />

                                        <FormikControl
                                        className={"col-md-8"}
                                        control="input"
                                        type="text"
                                        name="first_name"
                                        label="?????? "
                                        placeholder="?????? ???? ???????? ?????????? ?? ?????????? ?????????????? ????????"
                                        />
                                        <FormikControl
                                        className={"col-md-8"}
                                        control="input"
                                        type="text"
                                        name="last_name"
                                        label="?????? ????????????????"
                                        placeholder="?????? ???? ???????? ?????????? ?? ?????????? ?????????????? ????????"
                                        />

                                        <FormikControl
                                        className={"col-md-8"}
                                        control="input"
                                        type="text"
                                        name="phone"
                                        label="?????????? ????????????"
                                        placeholder="?????? ???? ?????????? ?????????????? ????????"
                                        />

                                        <FormikControl
                                        className={"col-md-8"}
                                        control="input"
                                        type="text"
                                        name="email"
                                        label="??????????"
                                        placeholder="?????? ???????? ?????????? (email@yourhost.com)"
                                        />

                                        <FormikControl
                                        className={"col-md-8"}
                                        control="input"
                                        type="text"
                                        name="password"
                                        label="???????? ????????"
                                        placeholder="?????? ???? ???????? ?????????? ?? ?????????? ?????????????? ????????"
                                        />

                                        <FormikControl
                                        className="col-md-8"
                                        control="date"
                                        formik={formik}
                                        name="birth_date"
                                        label="?????????? ????????"
                                        initialDate={userToEdit ? userToEdit.birth_date : undefined}
                                        yearsLimit={{from: 100, to:-10}}
                                        />

                                        <FormikControl
                                        className="col-md-6 col-lg-8"
                                        control="select"
                                        options={[{id:1 , value: "??????"} ,{id:0 , value: "????"}]}
                                        name="gender"
                                        label="??????????"
                                        />

                                        <FormikControl
                                        label="?????? ????"
                                        className="col-md-6 col-lg-8"
                                        control="searchableSelect"
                                        options={allRoles}
                                        name="roles_id"
                                        firstItem="???????? ?????? ?????? ???????? ?????? ???? ???????????? ????????"
                                        resultType="array"
                                        initialItems={selectedRoles}
                                        />

                                        <div className="btn_box text-center col-12 mt-4">
                                            <SubmitButton />
                                        </div>
                                        
                                    </div>
                                </Form>
                            )
                        }
                    }
                </Formik>
            </div>
        </ModalsContainer>
    );
}

export default AddUser;
