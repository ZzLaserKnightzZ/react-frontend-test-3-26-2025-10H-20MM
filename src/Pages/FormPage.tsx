import { BackToHomePage, CheckBox, ChnageLangContainre, ErrorText, FormContainer, FormText, FormWrap, FormWraperContainer, From, IdCardContainer, IdCardInputText, IdCardShowText, InputText, Label, MangeBtn, NormalRow, PaginationContainer, PaginationItem, PaginationSelecter, PaginationShiftLeft, PaginationShiftRight, RadioButton, Row1, Row2, Row3, Row4, Row5, Row6, Row7, SeeDataBtn, SelectOption, Separate, SortSign, SortSignContainer, Table, TableWraper, Tbody, Td, Th, Thead, Tr, TrHearder } from "../styled/FromPage.styled";
import { useAppDispatch } from "../reduxTk/store/store";
import { IPerson, MAX_PERSON_PERPAGE, currPageSelecter, deleteSelectedPerson, editpersonSelecter, pagination, personSelecter,  seedData, selectAllPerson, selectEditPerson, selectPerson, sortByGender, sortByName, sortByNationality, sortByPhoneNumber } from "../reduxTk/personSlice";
import { useDispatch, useSelector } from 'react-redux';
import { addPerson, deletePerson, editPerson } from "../reduxTk/personSlice"
import { v4 as uuidv4 } from 'uuid';
//import { nanoid } from "@reduxjs/toolkit";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { memo, useEffect, useState } from "react";
import { CValidation, useAutoValidate } from "../hook/useAutoValidate";
import { changeLanguage } from "i18next";
import { useTranslation } from "react-i18next";

export type TGender = {
    nameEN: string;
    nameTH: string;
    id: number;
}
export type TNationlity = {
    nameEN: string;
    nameTH: string;
    id: number;
}

export const GENDER_TABLE: TGender[] = [{
    nameEN: "Male",
    nameTH: "ผู้ชาย",
    id: 1
}, {
    nameEN: "FeMale",
    nameTH: "ผู้หญิง",
    id: 2
}, {
    nameEN: "Unsex",
    nameTH: "ไม่ระบุ",
    id: 3
}];

export const NATIONALITY_TABLE: TNationlity[] = [{
    nameEN: "THAI",
    nameTH: "ไทย",
    id: 1
}, {
    nameEN: "BRI",
    nameTH: "อังกฏษ",
    id: 2
}, {
    nameEN: "USA",
    nameTH: "สหรัฐ",
    id: 3
}];


export default function FormPage() {
    const { t } = useTranslation('translation', { keyPrefix: "FormPage" });
    return (
        <>
            <FormContainer>
                <FormText >{t("Banner")}</FormText>
                <BackToHomePage to="/">{t("Back")}</BackToHomePage>
                <ChnageLangContainre>
                    <ChangeLangeugeComponent />
                </ChnageLangContainre>
                <FormWraperContainer>
                    <FormWrap>
                        <FormComponent />
                    </FormWrap>
                    <TableComponent />
                </FormWraperContainer>
            </FormContainer>
        </>
    )
}

const FormComponent = memo(() => {
    const { t } = useTranslation('translation', { keyPrefix: "FormPage.FORM" });
    const { i18n } = useTranslation(); //i18n.language
    //const text = t('key'); // "here"
    const dispatcher = useAppDispatch();
    const person = useSelector(editpersonSelecter);
    //state form
    const [id, setId] = useState('');
    const prefix = useAutoValidate(new CValidation().MinLength(1));
    const name = useAutoValidate(new CValidation().MinLength(2).MaxLength(30).MatchRegX("^[ก-ฮแเ์ืใา่๋้็โี๊ะำัไึูุ]*$", "ภาษาไทยเท่านั้นนะจะ"));
    const lastName = useAutoValidate(new CValidation().MinLength(2).MaxLength(30).MatchRegX("^[ก-ฮแเ์ืใา่๋้็โี๊ะำัไึูุ]*$", "ภาษาไทยเท่านั้นนะจะ"));
    const dateOfBirth = useAutoValidate(new CValidation().MinLength(10).MaxLength(10).MatchRegX("[0-9]{1,2}-[0-9]{1,2}-[0-9]{1,4}"));
    const nationality = useAutoValidate(new CValidation().MinLength(1));
    const idcard = useAutoValidate(new CValidation().MinLength(13).MatchRegX("[0-9]+$"));
    const gender = useAutoValidate(new CValidation().MinLength(1, "กรุณาเลือกอย่างน้อย "));
    const preFixPhoneNumber = useAutoValidate(new CValidation().MinLength(2).MaxLength(2));
    const phoneNumber = useAutoValidate(new CValidation().MinLength(10).MaxLength(10).MatchRegX("^[0-9]*$"));
    const passPort = useAutoValidate(new CValidation().MinLength(1).MatchRegX("^[A-Za-z0-9]*$"));
    const expectSalary = useAutoValidate(new CValidation().MinLength(1).MatchRegX("^[0-9]*$"));



    const clickChangePrefixName = (e: React.ChangeEvent<HTMLSelectElement>) => prefix.setValue(e.target.value);
    const changeName = (e: React.ChangeEvent<HTMLInputElement>) => name.setValue(e.target.value);
    const changeLastName = (e: React.ChangeEvent<HTMLInputElement>) => lastName.setValue(e.target.value);
    const changeDateOfBirth = (e: React.ChangeEvent<HTMLInputElement>) => dateOfBirth.setValue(e.target.value);
    const changeNationality = (e: React.ChangeEvent<HTMLSelectElement>) => nationality.setValue(e.target.value);
    const changeIdCard = (e: React.ChangeEvent<HTMLInputElement>) => idcard.setValue(e.target.value);
    const clickSelectGender = (e: React.ChangeEvent<HTMLInputElement>) => gender.setValue(e.target.value);
    const changePreFixPhoneNumber = (e: React.ChangeEvent<HTMLSelectElement>) => preFixPhoneNumber.setValue(e.target.value);
    const changePhoneNumber = (e: React.ChangeEvent<HTMLInputElement>) => phoneNumber.setValue(e.target.value);
    const changePassPort = (e: React.ChangeEvent<HTMLInputElement>) => passPort.setValue(e.target.value);
    const changeSalaryExpect = (e: React.ChangeEvent<HTMLInputElement>) => expectSalary.setValue(e.target.value);


/*
    const validateCardId = (id: string) => {

        if (id.length !== 13) return false;
        const degit = id.split("");
        let sum = 0;
        let index = 0;
        for (let i = 13; i >= 2; i--) {
            sum += Number(degit[index]) * i;
            index++;
        }
        return 11 - (sum % 11) === Number(degit[12]);
    }*/

    const formatIdCard = (id: string) => {
        if (id.length !== 13) return id;
        return id.replace(/(\d{1})(\d{1,4})(\d{1,5})(\d{1,2})(\d{1})/, "$1-$2-$3-$4-$5")
    }

    const editForm = () => {
        if (person) {
            setId(person.id);
            prefix.setValue(person.prefix);
            name.setValue(person.name);
            lastName.setValue(person.lasName);
            dateOfBirth.setValue(person.dateOfbirth);
            nationality.setValue(person?.nationality?.id + "" || "");
            idcard.setValue(person.identityCard);
            gender.setValue(person?.gender?.id + "" || "");
            preFixPhoneNumber.setValue(person.prefexCellPhone);
            phoneNumber.setValue(person.cellPhone);
            passPort.setValue(person.passPort);
            expectSalary.setValue(person.saralyExpect);
        }
    }

    const clickClearForm = () => {
        prefix.setValue("0");
        prefix.clear();
        nationality.setValue("0");
        nationality.clear();
        preFixPhoneNumber.setValue("+66");
        preFixPhoneNumber.clear();

        name.setValue("");
        name.clear();
        lastName.setValue("");
        lastName.clear();
        dateOfBirth.setValue("");
        dateOfBirth.clear();
        idcard.setValue("");
        idcard.clear();
        gender.setValue("");
        gender.clear();
        phoneNumber.setValue("");
        phoneNumber.clear();
        passPort.setValue("");
        passPort.clear();
        expectSalary.setValue("");
        expectSalary.clear();
        setId('');
    }

    const clickAddForm = () => {
        //if(isValidate) for show only
        const person: IPerson = {
            id: id.length === 0 ? uuidv4() : id, //if new person or edite
            isSelected: false,
            isShowing: true,

            prefix: prefix.value,
            name: name.value,
            lasName: lastName.value,
            dateOfbirth: dateOfBirth.value,
            nationality: NATIONALITY_TABLE.find(n => n.id + "" == nationality.value),
            identityCard: idcard.value,
            gender: GENDER_TABLE.find(g => g.id + "" == gender.value),
            prefexCellPhone: preFixPhoneNumber.value,
            cellPhone: phoneNumber.value,
            passPort: passPort.value,
            saralyExpect: expectSalary.value
        }

        //if new person
        id ? dispatcher(editPerson(person)) : dispatcher(addPerson(person));
        console.log(id)
        clickClearForm();
    }

    useEffect(() => {
        prefix.setValue("0")
        nationality.setValue("0");
        preFixPhoneNumber.setValue("+66");
    }, []);

    useEffect(() => {
        editForm();
    }, [person]);


    return (<>
        <From>
            <Row1>
                <NormalRow maxWidthColumn="7rem">
                    <Label> <span><sub>*</sub>คำนำหน้าชื่อ</span></Label>
                    <SelectOption onChange={clickChangePrefixName} value={preFixPhoneNumber.value}>
                        <option value={0}>{t("Title")}</option>
                        <option value={1}>{t("PreNameMr")}</option>
                        <option value={2}>{t("PreNameMs")}</option>
                        <option value={3}>{t("PreNameMrs")}</option>
                    </SelectOption>
                </NormalRow>
                <NormalRow maxWidthColumn="4rem">
                    <Label><span><sub>*</sub>{t("FirstName")}</span></Label>
                    <InputText onChange={changeName} value={name.value} isValid={name.isValid} />
                </NormalRow>
                <NormalRow maxWidthColumn="5rem">
                    <Label><span><sub>*</sub>{t("LastName")}</span></Label>
                    <InputText onChange={changeLastName} value={lastName.value} isValid={lastName.isValid} />
                </NormalRow>
            </Row1>
            <ErrorText>{name.error + " " + lastName.error}</ErrorText>
            <Row2>
                <NormalRow maxWidthColumn={null} >
                    <Label><span><sub>*</sub>{t("Birthday")}</span></Label>
                    <InputText type="date" min="1990-01-01" max="2100-12-31" onChange={changeDateOfBirth} value={dateOfBirth.value} isValid={dateOfBirth.isValid} />
                </NormalRow>
                <NormalRow maxWidthColumn="4rem">
                    <Label><span><sub>*</sub>{t("NationNallity")}</span></Label>
                    <SelectOption onChange={changeNationality} value={nationality.value}>
                        <option value={0}>---{t("NationNallity")}---</option>
                        {
                            NATIONALITY_TABLE.map((n) => i18n.language == "th" ? <option key={n.id} value={n.id}>{n.nameTH}</option> : <option key={n.id} value={n.id}>{n.nameEN}</option>)
                        }
                    </SelectOption>
                </NormalRow>
            </Row2>
            <ErrorText>{dateOfBirth.error + " " + nationality.error}</ErrorText>
            <Row3>
                {/*ref.current.focus()เราไม่ใช้ */}
                <NormalRow maxWidthColumn="8rem">
                    <Label><span><sub>*</sub>{t("CitiCenID")}</span></Label>
                    <IdCardContainer>
                        <IdCardShowText readOnly value={formatIdCard(idcard.value)} />
                        <IdCardInputText onChange={changeIdCard} maxLength={13} />
                    </IdCardContainer>
                </NormalRow>
            </Row3>
            <ErrorText>{idcard.error + " "  ? "" : "เลขบัตประชาชนไม่ถูกต้อง"}</ErrorText>
            <Row4>
                <NormalRow maxWidthColumn={null}>
                    <Label><span><sub>*</sub>{t("Gender")}</span></Label>
                </NormalRow>
                {
                    GENDER_TABLE.map(g =>
                        i18n.language == "th" ?
                            <NormalRow key={g.id} maxWidthColumn={null}>
                                <RadioButton type="radio" name="gender" value={g.id} checked={gender.value == g.id + ""} onChange={clickSelectGender} />
                                <Label>{g.nameTH}</Label>
                            </NormalRow>
                            :
                            <NormalRow key={g.id} maxWidthColumn={null}>
                                <RadioButton type="radio" name="gender" value={g.id} checked={gender.value == g.id + ""} onChange={clickSelectGender} />
                                <Label>{g.nameEN}</Label>
                            </NormalRow>)
                }
            </Row4>
            <ErrorText>{gender.error}</ErrorText>
            <Row5>
                <NormalRow maxWidthColumn={null}>
                    <Label><span><sub>*</sub>{t("MobilePhone")}</span></Label>
                    <SelectOption onChange={changePreFixPhoneNumber} value={preFixPhoneNumber.value}>
                        <option value={"+66"}>+66{"(TH)"}</option>
                        <option value={"+77"}>+77{"(N/A)"}</option>
                        <option value={"+88"}>+88{"(USA)"}</option>
                    </SelectOption>
                </NormalRow>
                <NormalRow maxWidthColumn={null}>
                    <Label>-</Label>
                    <InputText onChange={changePhoneNumber} value={phoneNumber.value} isValid={phoneNumber.isValid} />
                </NormalRow>
            </Row5>
            <ErrorText>{phoneNumber.error}</ErrorText>
            <Row6>
                <NormalRow maxWidthColumn="20rem">
                    <Label><span><sub>*</sub>{t("Passport_No")}</span></Label>
                    <InputText onChange={changePassPort} value={passPort.value} isValid={passPort.isValid} />
                </NormalRow>
            </Row6>
            <ErrorText>{passPort.error}</ErrorText>
            <Row7>
                <NormalRow maxWidthColumn="10rem">
                    <Label><span><sub>*</sub> {t("ExpectSaraly")}</span></Label>
                    <InputText onChange={changeSalaryExpect} value={expectSalary.value} isValid={expectSalary.isValid} />
                </NormalRow>
                <NormalRow maxWidthColumn={null}>
                    <div></div>
                    <button onClick={clickClearForm}>{t("RESET")}</button>
                </NormalRow>
                <NormalRow maxWidthColumn={null}>
                    <button onClick={clickAddForm}>{t("SUBMIT")}</button>
                </NormalRow>
            </Row7>
            <ErrorText>{expectSalary.error}</ErrorText>
        </From></>);
});

const TableComponent = memo(() => {
    const { t } = useTranslation('translation', { keyPrefix: "FormPage.Table" });
    const { i18n } = useTranslation(); //i18n.language
    const dispatcher = useAppDispatch();
    const persons = useSelector(personSelecter);
    //sort
    const [isSortName, setIsSortName] = useState(false);
    const [isSortGender, setIsSortGender] = useState(false);
    const [isSortPhoneNumber, setIsSortPhoneNumber] = useState(false);
    const [isSortNationality, setIsSortNationality] = useState(false);
    //select  All person
    const [isSelectAllPerson, setIsSelectedAllPerson] = useState(false);


    const seedInit =()=>{
    const DUMMY_100PERSON:IPerson[] = [];
      for(let number=0; number < 200;number++){
        DUMMY_100PERSON.push({
          id: uuidv4(),
          isSelected: false,
          isShowing:number < MAX_PERSON_PERPAGE ,
          prefix: Math.floor(Math.random()*4)+"",
          name: "name:"+(number+1),
          lasName: "lastname:"+(number+1),
          dateOfbirth: "10-10-2025",
          identityCard: "1900000000000",
          prefexCellPhone: "+88",
          cellPhone: "0800000000",
          passPort: "9999999999",
          saralyExpect: "9999999999",
          nationality:NATIONALITY_TABLE[Math.floor(Math.random()*NATIONALITY_TABLE.length)],
          gender:GENDER_TABLE[Math.floor(Math.random()*GENDER_TABLE.length)]
        });
      }
      dispatcher(seedData(DUMMY_100PERSON));
    }

    return (<>
        <TableWraper>
            <input type="checkbox" onClick={() => {
                dispatcher(selectAllPerson({ isSelect: !isSelectAllPerson }));
                setIsSelectedAllPerson(x => !x);
            }} /> <label>{t("SelectAll")}</label>
            <button onClick={() => {
                dispatcher(deleteSelectedPerson({}));
            }}>{t("DeleteSelection")}</button>
            <SeeDataBtn onClick={seedInit}>
                seed 200 row
            </SeeDataBtn>
            <br /> <br />
            <Table>
                <Thead>
                    <TrHearder>
                        <Th onClick={() => {
                            dispatcher(sortByName({ upDown: isSortName }));
                            setIsSortName(x => !x);
                        }}>{t("Name")}
                            <Separate>
                                <SortSignContainer>
                                    <SortSign>
                                        <AiFillCaretUp />
                                        <AiFillCaretDown />
                                    </SortSign>
                                    <span>|</span>
                                </SortSignContainer>
                            </Separate>
                        </Th>
                        <Th onClick={() => {
                            dispatcher(sortByGender({ upDown: isSortGender }));
                            setIsSortGender(x => !x);
                        }}>{t("Gender")}
                            <Separate>
                                <SortSignContainer>
                                    <SortSign>
                                        <AiFillCaretUp />
                                        <AiFillCaretDown />
                                    </SortSign>
                                    <span>|</span>
                                </SortSignContainer>
                            </Separate>
                        </Th>
                        <Th onClick={() => {
                            dispatcher(sortByPhoneNumber({ upDown: isSortPhoneNumber }));
                            setIsSortPhoneNumber(x => !x);
                        }}>{t("Phone")}
                            <Separate>
                                <SortSignContainer>
                                    <SortSign>
                                        <AiFillCaretUp />
                                        <AiFillCaretDown />
                                    </SortSign>
                                    <span>|</span>
                                </SortSignContainer>
                            </Separate>
                        </Th>
                        <Th onClick={() => {
                            dispatcher(sortByNationality({ upDown: isSortNationality }));
                            setIsSortNationality(x => !x);
                        }}>{t("NationNallity")}
                            <Separate>
                                <SortSignContainer>
                                    <SortSign>
                                        <AiFillCaretUp />
                                        <AiFillCaretDown />
                                    </SortSign>
                                    <span>|</span>
                                </SortSignContainer>
                            </Separate>
                        </Th>
                        <Th>{t("Manage")}</Th>
                    </TrHearder>
                </Thead>
                <Tbody>
                    {
                        persons.filter(x => x.isShowing === true).map(x =>
                            <Tr key={x.id}>
                                <Td><CheckBox readOnly type="checkbox" checked={x.isSelected} onClick={() => dispatcher(selectPerson({ id: x.id }))} /> {"  "+x.name}</Td>
                                <Td>{i18n.language == "th" ? x.gender?.nameTH : x.gender?.nameEN}</Td>
                                <Td>{x.cellPhone}</Td>
                                <Td>{i18n.language == "th" ? x.nationality?.nameTH : x.nationality?.nameEN}</Td>
                                <Td onClick={() => dispatcher(selectEditPerson(x))}><MangeBtn>{t("Edit")}</MangeBtn><MangeBtn onClick={() => dispatcher(deletePerson({ id: x.id }))}>{t("Delete")}</MangeBtn></Td>
                            </Tr>)
                    }
                </Tbody>
            </Table>
            <br />
            <br />
            <center>
                <PaginationComponent />
            </center>
        </TableWraper></>);
});

const PaginationComponent = memo(() => {
    const dispatcher = useDispatch();
    const persons = useSelector(personSelecter);
    const page = useSelector(currPageSelecter);
    const { t } = useTranslation('translation', { keyPrefix: 'FormPage.Pagination' });
    return (<>
        <PaginationContainer>
            <PaginationShiftLeft>&lt;{t("Prev")}</PaginationShiftLeft>
            <PaginationSelecter>
                {Array.from({ length: Math.ceil(persons.length / MAX_PERSON_PERPAGE) }).map((_, i) => i + 1).map(p =>
                    <PaginationItem
                        key={p}
                        isActive={p == page}
                        onClick={() => {
                            dispatcher(pagination({ page:p }));
                        }} >
                        {p}
                    </PaginationItem>)}
            </PaginationSelecter>
            <PaginationShiftRight>{t("Next")}&gt;</PaginationShiftRight>
        </PaginationContainer></>);
});

const ChangeLangeugeComponent = () => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(e.target.selectedIndex)
        switch (e.target.selectedIndex) {
            case 0: changeLanguage("en"); break;
            case 1: changeLanguage("th"); break;
        }
    };

    return (<>
        <select onChange={handleChange}>
            <option>EN</option>
            <option>TH</option>
        </select>
    </>);
}