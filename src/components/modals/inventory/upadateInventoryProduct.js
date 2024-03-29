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
import { faCheck, faSlash } from "@fortawesome/free-solid-svg-icons";
import { firestoreDb, storage } from "../../../firebase";
import uuid from "react-uuid";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import "../../../css/teacher.css";
import "../courses/style.css";
import "../teacher/style.css";
import { textAlign } from "@mui/system";
import Icon from 'react-eva-icons'
import { BorderHorizontalOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";

const { Option } = Select;
const { Search } = Input;

const ItemCategory = ["Book", "Excercisebook", "Pen", "Pencil", "paper"];
const ItemsSupplier = ["ABC Trading", "DoubleA papers", "AtoZ plc"]

const UpdateInventoryProduct = ({ open, setOpen, data }) => {
    console.log(data)
    const uid = useSelector((state) => state.user.profile);
    const school = useSelector((state) => state.user.profile.school);
    var [updateProduct, setupdateProduct] = useState({
        ItemName: data.ItemName,
        Category: data.Category,
        ItemCount: data.ItemCount,
        TotalItem: data.TotalItem,
        Supplier: data.Supplier,
        price: data.price,
        Description: data.Description,
        school_id: uid.school,
    });

    const valueRef = useRef();

    const createUpdateProduct = async () => {
        message.success("Product Updated");
        console.log(updateProduct);
        setOpen(false);
    };

    const handleUpdateProduct = (e) => {
        setupdateProduct({ ...updateProduct, [e.target.name]: e.target.value });
    };

    const handleCategory = (value) => {
        setupdateProduct({ ...updateProduct, Category: value });
    };

    const handleSupplier = (value) => {
        setupdateProduct({ ...updateProduct, Supplier: value });
    };

    const onClose = () => {
        setOpen(false);
    };

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
                        <label style={{ paddingBottom: 6 }}>Product Name</label>
                        <Input
                            style={{ marginTop: 6 }}
                            className="py-6 mt-6 !rounded-lg !border-[#d3d3d3] "
                            name="ItemName"
                            defaultValue={updateProduct.ItemName}
                            placeholder="Books"
                            onChange={(e) => handleUpdateProduct(e)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4 ">
                        <div className="py-2 ">
                            <label>Add Item Count</label>
                            <Input
                                prefix={"+"}
                                style={{ marginTop: 6 }}
                                className=" !rounded-lg !border-[#d3d3d3] "
                                name="ItemCount"
                                type="number"
                                defaultValue={updateProduct.ItemCount}
                                placeholder="200"
                                onChange={(e) => handleUpdateProduct(e)}
                            />
                            <p className="text-[#98A2B3] text-sm m-0">The amount of item to be added to stock.</p>
                        </div>
                        <div className="py-2 ">
                            <label>Instock Count</label>
                            <Input
                                style={{ marginTop: 6, color: "#475467" }}
                                className=" !rounded-lg !border-[#d3d3d3] text-[#475467]"
                                name="TotalItem"
                                readOnly
                                defaultValue={updateProduct.TotalItem}
                                placeholder="1000"
                                onChange={(e) => handleUpdateProduct(e)}
                            />
                            <p className="text-[#98A2B3] text-sm m-0 ">The total amount in stock</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 ">

                        <div className="py-2 ">
                            <label>Add Tag</label>
                            <Select
                                bordered={true}
                                placeholder="Add Tag"
                                onChange={handleCategory}
                                className="py-6 mt-6 !rounded-lg !border-[#d3d3d3] hover:border-[#667085]"
                                defaultValue={updateProduct.Category}
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
                            <p className="text-[#98A2B3] text-sm m-0 ">Add amount of item to be ordered.</p>
                        </div>
                        <div className="py-2 ">
                            <label>Price/unit</label>
                            <Input
                                prefix={"ETB"}
                                suffix={"Add Pricing"}
                                style={{ marginTop: 6, color: "#475467" }}
                                className=" !rounded-lg !border-[#d3d3d3] text-[#475467]"
                                name="price"
                                type="number"
                                defaultValue={updateProduct.price}
                                placeholder="1000"
                                onChange={(e) => handleUpdateProduct(e)}
                            />
                            <p className="text-[#98A2B3] text-sm m-0 ">Add the price of each unit item.</p>
                        </div>
                    </div>
                    <div className="py-2 ">
                        <label>Suppliers </label>
                        <Select
                            bordered={true}
                            placeholder="Select supplier"
                            className="py-6 mt-6 !rounded-lg !border-[#d3d3d3] hover:border-[#667085]"
                            onChange={handleSupplier}
                            defaultValue={updateProduct.Supplier}
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
                    </div>
                    <div className="py-2 ">
                        <label>Description </label>
                        <TextArea
                            style={{ marginTop: 6 }}
                            placeholder="Add Description"
                            rows={6}
                            name="Description"
                            defaultValue={updateProduct.Description}
                            onChange={(e) => handleUpdateProduct(e)}
                        />

                    </div>
                </div>
                <div className="absolute bottom-0 w-[100%] mb-3  ">
                    <Button className="w-[25%] mr-5 !rounded-lg" onClick={onClose}>Cancel</Button>
                    <Button
                        className="w-[65%] !bg-[#DC5FC9] !text-[white] hover:!text-[white] !rounded-lg shadow-md -z-0 "
                        onClick={async () => await createUpdateProduct()}
                        icon={<FontAwesomeIcon className="mr-2" icon={faCheck} />}
                    >
                        Confirm
                    </Button>
                </div>
            </Drawer>
        </div>
    );
};

export default UpdateInventoryProduct;
