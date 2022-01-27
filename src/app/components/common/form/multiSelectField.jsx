import React from "react";
import Select from "react-select";
import PropTypes from "prop-types";

const MultiSelectField = ({ options, onChange, name, label, defaultValue }) => {
    const optionsArray = (optionArr) => {
        const newOptions = !Array.isArray(optionArr) && typeof optionArr === "object"
            ? Object.keys(optionArr).map((optionName) => ({
                    label: optionArr[optionName].name,
                    value: optionArr[optionName]._id
                }))
            : optionArr.map((option) => ({
                    label: option.name,
                    value: option._id
                }));
        return newOptions;
    };
    const handleChange = (value) => {
        onChange({ name: name, value });
    };
    return (
        <div className="mb-4">
            <label className={"form-label" + options.color}>{label}</label>
            <Select
                isMulti
                closeMenuOnSelect={false}
                defaultValue={optionsArray(defaultValue)}
                options={optionsArray(options)}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={handleChange}
                name={name}
            />
        </div>
    );
};
MultiSelectField.propTypes = {
    options: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    onChange: PropTypes.func,
    name: PropTypes.string,
    label: PropTypes.string,
    defaultValue: PropTypes.array
};

export default MultiSelectField;
