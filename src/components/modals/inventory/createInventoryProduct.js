import React, { useEffect, useState, useRef } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { createParentwhithStudent, fetchClass } from "../funcs";
import { Input, Button, Select, message, DatePicker, Drawer } from "antd";
import {
    doc,
    setDoc,
    getDocs,
    collection,
    where,
    query,
    getDoc,
    arrayUnion,
    updateDoc,
} from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { firestoreDb, storage } from "../../../firebase";
import uuid from "react-uuid";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "react-phone-number-input/style.css";
import "../../../css/teacher.css";
import "../courses/style.css";
import "../teacher/style.css";
import Icon from 'react-eva-icons'
import TextArea from "antd/lib/input/TextArea";
import CreateNewSupplier from '../../subComponents/CreateSupplier'

const { Option } = Select;
const { Search } = Input;

const ItemCategory = ["Book", "Excercisebook", "Pen", "Pencil", "paper"];
const ItemsSupplier = ["ABC Trading", "DoubleA papers", "AtoZ plc"]

const CreateInventoryProduct = ({ open, setOpen }) => {
    const uid = useSelector((state) => state.user.profile);
    const school = useSelector((state) => state.user.profile.school);
    const [openSupplier, setOpenSupplier] = useState(false)
    var [newProduct, setnewProduct] = useState({
        ItemName: "",
        Category: "",
        ItemCount: "",
        TotalItem: "1000",
        Supplier: "",
        Description: "",
        school_id: uid.school,
    });

    const valueRef = useRef();


    const createNewProduct = async () => {
        message.success("New Product Created")
        console.log(newProduct)
        setOpen(false);
    };

    const handleProduct = (e) => {
        setnewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };

    const handleCategory = (value) => {
        setnewProduct({ ...newProduct, Category: value });
    };

    const handleSupplier = (value) => {
        setnewProduct({ ...newProduct, Supplier: value });
    };

    const onClose = () => {
        setOpen(false);
    };

    const handleNewSupplier = () => {
        setOpenSupplier(true)
    }

    return (
        <div className="bg-[#F9FAFB] min-h-[100vh]  -mt-14">
            <Drawer
                title={<div className="flex justify-between">
                    <span>Create Product</span>
                    <button style={{ color: 'black' }}
                        onClick={onClose}
                    >
                        <Icon fill={"#98A2B3"} name="close-outline" size="medium" />
                    </button>
                </div>}
                width={620}
                onClose={onClose}
                closable={false}
                headerStyle={{ justifyContent: 'space-between' }}
                open={open}
                bodyStyle={{ paddingBottom: 80 }}
                contentWrapperStyle={{ alignSelf: 'flex-end' }}
            >
                <div className="bg-[#FFF]">
                    <div className="py-2 ">
                        <label style={{ paddingBottom: 6 }}>Item Name</label>
                        <Input
                            style={{ marginTop: 6 }}
                            required
                            className="py-6 mt-6 !rounded-lg !border-[#d3d3d3] "
                            name="ItemName"
                            placeholder="Books"
                            onChange={(e) => handleProduct(e)}
                        />
                    </div>
                    <div className="py-2 ">
                        <label>Item Category </label>
                        <Select
                            bordered={true}
                            placeholder="Select Category"
                            className="py-6 mt-6 !rounded-lg !border-[#475467] hover:border-[#667085]"
                            onChange={handleCategory}
                            optionLabelProp="label"
                            style={{
                                width: "100%",
                                marginTop: 6,
                            }}
                        >
                            {ItemCategory.map((item, index) => (
                                <Option key={index} value={item} label={item}>
                                    {item}
                                </Option>
                            ))}
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4 ">

                        <div className="py-2 ">
                            <label>Item Count</label>
                            <Input
                                style={{ marginTop: 6 }}
                                required
                                className=" !rounded-lg !border-[#d3d3d3] "
                                name="ItemCount"
                                type="number"
                                placeholder="200"
                                onChange={(e) => handleProduct(e)}
                            />
                            <p className="text-[#98A2B3] text-sm mt-3 ">Add the amount of item to be Ordered</p>
                        </div>
                        <div className="py-2 ">
                            <label>Total Item</label>
                            <Input
                                style={{ marginTop: 6, color: "#475467" }}
                                required
                                className=" !rounded-lg !border-[#d3d3d3] text-[#475467]"
                                readOnly
                                type="number"
                                name="TotalItem"
                                value={newProduct.TotalItem}
                                onChange={(e) => handleProduct(e)}
                            />
                            <p className="text-[#98A2B3] text-sm mt-3 ">The Total amount of book</p>
                        </div>
                    </div>
                    <div className="py-2 ">
                        <label>Suppliers </label>
                        <Select
                            bordered={true}
                            placeholder="Select supplier"
                            className="py-6 mt-6 !rounded-lg !border-[#d3d3d3] hover:border-[#667085]"
                            onChange={handleSupplier}
                            optionLabelProp="label"
                            style={{
                                width: "100%",
                                marginTop: 6,
                            }}
                        >
                            {ItemsSupplier.map((item, index) => (
                                <Option key={index} value={item} label={item}>
                                    {item}
                                </Option>
                            ))}
                        </Select>
                        <div className="flex">
                            <p className="text-[#98A2B3] text-sm mt-3 mr-1 ">Didn't found supplier in the list?</p>
                            <a onClick={handleNewSupplier} className="text-[#dc5fc9] text-sm mt-3">Create a new Supplier</a>
                        </div>
                    </div>
                    <div className="py-2 ">
                        <label>Description </label>
                        <TextArea
                            style={{ marginTop: 6 }}
                            placeholder="Add Description"
                            rows={6}
                            name="Description"
                            onChange={(e) => handleProduct(e)}
                        />
                    </div>
                </div>
                <div className="absolute bottom-0 w-[100%] mb-3  ">
                    <Button className="w-[25%] mr-5 !rounded-lg" onClick={onClose}>Cancel</Button>
                    <Button
                        className="w-[65%] !bg-[#DC5FC9] !text-[white] hover:!text-[white] !rounded-lg shadow-md -z-0 "
                        onClick={async () => await createNewProduct()}
                        icon={<FontAwesomeIcon className="mr-2" icon={faCheck} />}
                    >
                        Confirm
                    </Button>
                </div>
            </Drawer>
            <CreateNewSupplier
                open={openSupplier}
                setOpen={setOpenSupplier}
            />
        </div>
    );
};

export default CreateInventoryProduct;
