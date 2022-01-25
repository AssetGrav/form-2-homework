import React, { useEffect, useState } from "react";
import { validator } from "../../utils/validator";
import TextField from "../common/form/textField";
import api from "../../api";
import SelectField from "../common/form/selectField";
import RadioField from "../common/form/radioField";
import MultiSelectField from "../common/form/multiSelectField";
import { useHistory } from "react-router-dom";
const EditPage = () => {
    const history = useHistory();
    const userId = history.location.pathname.substring(7, 31);
    function setObjUser(obj, data) {
        for (let i = 0; i < Object.keys(obj).length; i++) {
            const key = Object.keys(obj)[i];
            if (Object.keys(data).includes(key) && typeof obj[key] === "string") {
                obj[key] = data[key];
            } else if (Object.keys(data).includes(key) && typeof obj[key] === "object") {
                obj[key] = !Array.isArray(data[key])
                    ? data[key]._id
                    : Object.keys(data[key]).map((optionName) => ({
                        label: data[key][optionName].name,
                        value: data[key][optionName]._id
                    }));
            }
        }
        return obj;
    };
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        profession: "",
        sex: "male",
        qualities: []
    });
    const [qualities, setQualities] = useState({});
    const [professions, setProfession] = useState();
    const [errors, setErrors] = useState({});
    useEffect(() => {
        api.users.getById(userId).then((date) =>
            setData((data) => setObjUser(data, date)
        ));
        api.professions.fetchAll().then((data) => setProfession(data));
        api.qualities.fetchAll().then((data) => setQualities(data));
    }, []);
    useEffect(() => {
        qualitiesChange(data.qualities);
    }, []);
    const handleChange = (target) => {
        console.log("targ", target);
        if (target.name === "qualities") {
            setData((prevState) => (
                {
                ...prevState,
                [target.name]: target.value
            }));
        }
    };
    const validatorConfig = {
        name: {
            isRequired: {
                message: "Заполните Имя и фамилию"
            }
        },
        email: {
            isRequired: {
                message: "Электронная почта обязательна для заполнения"
            },
            isEmail: {
                message: "Email введен некорректно"
            }
        },
        profession: {
            isRequired: {
                message: "Обязательно выберите вашу профессию"
            }
        },
        licence: {
            isRequired: {
                message:
                    "Вы не можете использовать наш сервис без подтверждения лицензионного соглашения"
            }
        }
    };
    useEffect(() => {
        validate();
    }, [data]);
    console.log(data);
    const validate = () => {
        const errors = validator(data, validatorConfig);
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const isValid = Object.keys(errors).length === 0;

    const handleSubmit = (e) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) return;
        console.log(data);
    };
    function qualitiesChange(value) {
        console.log("val", value);
        if (value.length !== 0) {
            return handleChange({ name: "qualities", value });
        };
    };
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6 offset-md-3 shadow p-4">
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Имя"
                            value={data.name}
                        />
                        <TextField
                            label="Электронная почта"
                            name="email"
                            value={data.email}
                            onChange={handleChange}
                            error={errors.email}
                        />
                        <SelectField
                            label="Выбери свою профессию"
                            defaultOption="Choose..."
                            options={professions}
                            name="profession"
                            onChange={handleChange}
                            value={typeof data.profession === "string" ? data.profession : undefined}
                            error={errors.profession}
                        />
                        <RadioField
                            options={[
                                { name: "Male", value: "male" },
                                { name: "Female", value: "female" },
                                { name: "Other", value: "other" }
                            ]}
                            value={data.sex}
                            name="sex"
                            onChange={handleChange}
                            label="Выберите ваш пол"
                        />
                        <MultiSelectField
                            options={qualities}
                            onChange={handleChange}
                            defaultValue={qualitiesChange(data.qualities)}
                            name="qualities"
                            label="Выберите ваши качества"
                        />
                        <button
                            className="btn btn-primary w-100 mx-auto"
                            type="submit"
                            disabled={!isValid}
                        >
                            Сохранить
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditPage;
