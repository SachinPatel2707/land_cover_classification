
import React, {useState} from "react";
import "./Modal.css";
import { RiCloseLine } from "react-icons/ri";

const Modal = ({ setIsOpen, msgs }) => {
    const [msgIdx, setMsgIdx] = useState(0);

    return (
        <>
        <div className={'darkBG'} onClick={() => setIsOpen(false)} />
        <div className={'centered'}>
            <div className={'modal'}>
            <div className={'modalHeader'}>
                <h5 className={'heading'}>Instructions</h5>
            </div>
            <button className={'closeBtn'} onClick={() => setIsOpen(false)}>
                <RiCloseLine style={{ marginBottom: "-3px" }} />
            </button>
            <div className={'modalContent'}>
                {msgs[msgIdx]}
            </div>
            <div className={'modalActions'}>
                <div className={'actionsContainer'}>
                <button className={'deleteBtn'}>
                    Next
                </button>
                <button
                    className={'cancelBtn'}
                    onClick={() => setIsOpen(false)}
                >
                    Cancel
                </button>
                </div>
            </div>
            </div>
        </div>
        </>
    );
};

export default Modal;