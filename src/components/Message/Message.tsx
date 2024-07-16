import userImg from '../../assets/images/user.png';
import React, {useEffect, useRef, useState} from "react";
import './message-light-theme.scss';
import './message-dark-theme.scss';
import textImg from '../../assets/images/FileImg/text.png';
import other from '../../assets/images/FileImg/other.png';
import pdfImg from '../../assets/images/FileImg/pdf.png';
import docImg from '../../assets/images/FileImg/doc.png';
import xlsxImg from '../../assets/images/FileImg/xlsx.png';
import pptxImg from '../../assets/images/FileImg/pptx.png';
import {doc, getDoc} from "firebase/firestore";
import {db} from "../firebase";

interface Message {
    createAt: string;
    id: number;
    name: string;
    mes: string;
    to: string;
    type: number;
}

interface Media {
    type: number;
    url: string;
}

interface Document {
    url: string;
    file: File;
    type: string;
    name: string;
}

interface MessageProps {
    message: Message | null;
    theme?: string | null | undefined;
    filterKeyword: string;
    idMess: string;
    setSelectedImage: (value: (((prevState: (string)) => (string)) | string)) => void;
}

function Message({message, theme, filterKeyword, idMess, setSelectedImage}: MessageProps) {
    const [mes, setMes] = useState<any>();
    const timeRef = useRef<HTMLDivElement>(null);
    const [hoverTimer, setHoverTimer] = useState<NodeJS.Timeout | null>(null);

    const handleClickImage = (index: number) => {
        setSelectedImage(medias ? medias[index].url : "");
    };

    useEffect(() => {
        const fetchData = async (idMes: string) => {
            const docSnap = await getDoc(doc(db, 'messages', idMes));

            if (docSnap.exists()) {
                const iconMes = docSnap.data();
                setMes(iconMes.mes);
            }
        };

        const processMessage = (msg: Message) => {
            if (isJsonString(msg.mes)) {
                const mesData = JSON.parse(msg.mes);
                if (!mesData.idMes || mesData.idMes === "") {
                    setMes(mesData.message);
                } else {
                    fetchData(mesData.idMes);
                }
            } else {
                setMes(msg.mes);
            }
        };

        if (message) {
            processMessage(message);
        }
    }, [message]);

    useEffect(() => {
        const highlightText = (text: string, term: string) => {
            if (!term) return text;

            const regex = new RegExp(`(${term})`, 'gi');
            const parts = text.split(regex);

            return parts.map((part, index) =>
                part.toLowerCase() === term.toLowerCase() ? <span key={index} className="highlight">{part}</span> : part
            );
        };

        if (message?.mes) {
            if (isJsonString(message?.mes)) {
                const parsedMessage = JSON.parse(message.mes);
                const highlighted = highlightText(parsedMessage.message, filterKeyword);
                setMes(highlighted);
            } else {
                const highlighted = highlightText(message?.mes, filterKeyword);
                setMes(highlighted);
            }
        }
    }, [filterKeyword, message?.mes]);

    useEffect(() => {
        return () => {
            if (hoverTimer) {
                clearTimeout(hoverTimer);
            }
        };
    }, [hoverTimer]);

    const handleMouseEnter = () => {
        setHoverTimer(setTimeout(() => {
            if (timeRef.current) {
                timeRef.current.style.display = 'flex';
                timeRef.current.style.alignItems = 'center';
            }
        }, 500));
    };

    const handleMouseLeave = () => {
        if (hoverTimer) {
            clearTimeout(hoverTimer);
            setHoverTimer(null);
        }

        if (timeRef.current) {
            timeRef.current.style.display = 'none';
        }
    };

    const medias: Media[] | null = (() => {
        try {
            if (message?.mes) {
                const parsedMessage = JSON.parse(message.mes);
                return parsedMessage.medias || null;
            }
            return null;
        } catch (error) {
            return null;
        }
    })();

    const files: Document[] | null = (() => {
        try {
            if (message?.mes) {
                const parsedMessage = JSON.parse(message.mes);
                return parsedMessage.files || null;
            }
            return null;
        } catch (error) {
            return null;
        }
    })();

    const isJsonString = (str: string) => {
        try {
            const parsedString = JSON.parse(str);
            return (typeof parsedString === 'object') && (parsedString !== null) && (!Array.isArray(parsedString));
        } catch (e) {
            return false;
        }
    };

    const getFileIcon = (fileName: string) => {
        try {
            switch (fileName.split('.').pop()) {
                case 'txt':
                    return textImg;
                case 'pdf':
                    return pdfImg;
                case 'docx':
                    return docImg;
                case 'xlsx':
                    return xlsxImg;
                case 'pptx':
                    return pptxImg;
                default:
                    return other;
            }
        } catch (error) {
            return other;
        }
    };

    const formatDateTime = (dateTime: string) => {
        let dateTimeArr = dateTime.split(' ');

        if (dateTime && dateTimeArr.length !== 2) {
            dateTimeArr = dateTime.split('T');
        }

        const [year, month, day] = dateTimeArr[0]?.split('-');
        const [hours, minutes] = dateTimeArr[1]?.split(':');

        let newYear = parseInt(year);
        let newMonth = parseInt(month);
        let newDay = parseInt(day);

        let newHour = parseInt(hours) + 7;
        let newMinute = parseInt(minutes);

        if (newMinute >= 60) {
            newMinute %= 60;
            newHour += 1;
        }

        if (newHour >= 24) {
            newHour %= 24;
            newDay += 1;
        }

        let stringHour = newHour.toString();
        let stringMinute = newMinute.toString();

        if (stringHour.length < 2) {
            stringHour = '0' + stringHour;
        }

        if (stringMinute.length < 2) {
            stringMinute = '0' + stringMinute;
        }

        const date = newDay + '/' + newMonth + '/' + newYear;
        const time = stringHour + ':' + stringMinute;

        return date + ' ' + time
    }

    return (
        <div className={`message-container ${theme}`}>
            <div className="message-author">
                <p>{message?.name}</p>
            </div>

            <div className="message-content">
                <div className="main-message"

                     onMouseEnter={handleMouseEnter}
                     onMouseLeave={handleMouseLeave}>

                    {mes && <div className="message-line">
                        <img className="avatar" src={userImg} alt=""/>
                        <div className="mess" id={idMess}>{mes}</div>
                    </div>}

                    {medias && medias.length > 0 && (
                        <div className="media-container">
                            <div className="media-item">
                                <img className="avatar" src={userImg} alt=""/>
                            </div>

                            {medias.map((media, index) => (
                                media.type === 0 ? (
                                    <div key={index} className="media-item">
                                        <img onClick={() => handleClickImage(index)} key={index} className="send-image"
                                             src={media.url} alt="sent image"/>
                                    </div>
                                ) : (
                                    <div key={index} className="media-item">
                                        <video key={index} className="send-video" src={media.url} controls/>
                                    </div>
                                )
                            ))}

                            <div className="time-message" ref={timeRef}>
                                <p>
                                    {message && formatDateTime(message.createAt)}
                                </p>
                            </div>
                        </div>
                    )}

                    {files && files.length > 0 && (
                        <div className="file-container">
                        <img className="avatar" src={userImg} alt=""/>
                            <div className="file">
                                {files.map((file, index) => (
                                    <a key={index} href={file.url} target="_blank" rel="noopener noreferrer"
                                       download={file.name}
                                       className="send-file">
                                        <img src={
                                            getFileIcon(file.name)
                                        } alt={file.name}/>
                                        {file.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {medias && medias.length <= 0 && (
                    <div className="time-message" ref={timeRef}>
                        <p>
                            {message && formatDateTime(message.createAt)}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Message;
