
import isEqual from 'lodash/isEqual';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-final-form';

/*
    Alternative for FormSpy
*/
const useFormValues = (fields = []) => {
    if (!Array.isArray(fields)) {
        throw new Error('fields have to by array');
    }
    const valuesRef = useRef({});
    const [values, setValues] = useState(
        fields.reduce((acc, field) => ({ ...acc, [field]: null }), {})
    );
    const form = useForm();
    useEffect(() => {
        const unsubscribe = form.subscribe(
            ({ values: formValues }) => {
                const changedValues = fields.reduce(
                    (acc, field) => ({ ...acc, [field]: formValues[field] }),
                    {}
                );
                if (!isEqual(valuesRef.current, changedValues)) {
                    valuesRef.current = changedValues;
                    setValues(changedValues);
                }
            },
            { values: true }
        );

        return () => {
            unsubscribe();
        };
    }, [form, fields]);
    return values;
};

export { useFormValues };
