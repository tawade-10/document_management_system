import React, { useEffect, useRef } from "react";

export default function ColumnMenu({
    column,
    title,
    values = [],
    selectedValues = [],
    onSelectionChange,
    onSort,
    onApply,
    onClose
}) {

    const menuRef = useRef(null);

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                onClose();
            }

        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };

    }, [onClose]);

    const isChecked = (value) => {

        return selectedValues.includes(value);

    };

    const handleCheckbox = (value) => {

        let updated = [];

        if (selectedValues.includes(value)) {

            updated = selectedValues.filter(
                item => item !== value
            );

        } else {

            updated = [
                ...selectedValues,
                value
            ];

        }

        onSelectionChange(updated);

    };

    const handleSelectAll = () => {

        if (selectedValues.length === values.length) {

            onSelectionChange([]);

        } else {

            onSelectionChange(values);

        }

    };

    return (

        <div
            className="column-menu"
            ref={menuRef}
        >

            <div className="column-menu-title">

                {title}

            </div>

            <div
                className="column-menu-item"
                onClick={() => onSort(column, "asc")}
            >

                ↑ Sort A to Z

            </div>

            <div
                className="column-menu-item"
                onClick={() => onSort(column, "desc")}
            >

                ↓ Sort Z to A

            </div>

            <div className="column-menu-divider"></div>

            <div className="column-menu-search">

                <input
                    type="text"
                    placeholder="Search..."
                    disabled
                />

            </div>

            <div className="column-menu-divider"></div>

            <div className="column-menu-values">

                <label className="checkbox-item">

                    <input
                        type="checkbox"
                        checked={
                            selectedValues.length === values.length
                            &&
                            values.length > 0
                        }
                        onChange={handleSelectAll}
                    />

                    Select All

                </label>

                {
                    values.map(value => (

                        <label
                            key={value}
                            className="checkbox-item"
                        >

                            <input
                                type="checkbox"
                                checked={isChecked(value)}
                                onChange={() => handleCheckbox(value)}
                            />

                            {value}

                        </label>

                    ))
                }

            </div>

            <div className="column-menu-divider"></div>

            <div className="column-menu-footer">

                <button
                    className="apply-btn"
                    onClick={onApply}
                >

                    Apply

                </button>

                <button
                    className="cancel-btn"
                    onClick={onClose}
                >

                    Cancel

                </button>

            </div>

        </div>
    );
}