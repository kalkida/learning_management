import React, { useEffect, useState } from "react";
import { Space, Table, Button,Tabs , DatePicker } from "antd";
import { useSelector } from "react-redux";
import { firestoreDb } from "../../firebase";
import { Tooltip, Timeline, Statistic } from "antd";
import { useNavigate } from "react-router-dom";
import { Input } from "antd";
import { Select } from "antd";
import { faArrowUp} from "@fortawesome/free-solid-svg-icons";
import "../modals/courses/style.css";
import "react-phone-number-input/style.css";
import { SearchOutlined } from "@ant-design/icons";
import Icon from 'react-eva-icons'
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../modals/student/style.css";
import CreateNewInventory from "./CreateInventory";
import ChartStudent from "../graph/studentGraph/Chart";
import { Card, Progress, } from "antd";
import CreateNewSupplier from "./CreateSupplier";
import EditSupplier from "../modals/inventory/EditSupply";
import HistorySupplier from "../modals/inventory/HistorySupply";
import Grid from "@mui/material/Grid";

const { Option } = Select;
const { Search } = Input;

const { RangePicker } = DatePicker;

export default function Inventory() {
  const school = useSelector((state) => state.user.profile.school);
  const navigate = useNavigate();
  const [datarecord, setDatarecord] = useState({});
  const [open, setOpen] = useState(false);
  const [EditSupply , setEditSupply] = useState(false);
  const [HistorySupply ,setHistorySupply] = useState(false);
  const [openSupplier, setOpenSupplier] = useState(false);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [students, setStudents] = useState([]);
  var datas = [
    { name: "Sept", Total: 120 , totalday : "2" , howmuch : 0 },
    { name: "Oct", Total: 100 , totalday : "3" , howmuch : 0 },
    { name: "Nov", Total: 90 , totalday :"19", howmuch : 0 },
    { name: "Dec", Total: 70 , totalday:"23" , howmuch : 0},
    { name: "Jan", Total: 130 , totalday:"12" , howmuch : 0},
    { name: "Feb", Total: 60 ,totalday:"21" , howmuch : 0},
    { name: "Mar  ", Total: 150 ,totalday:"16" , howmuch : 0},
    { name: "Apr", Total: 110 ,totalday:"6" , howmuch : 0},
    { name: "May", Total: 80 ,totalday :"28" , howmuch : 0},
    { name: "June", Total: 70 , totalday :"13" , howmuch : 0},
    { name: "July", Total: 100 ,totalday :"17"  , howmuch : 0},
    { name: "Aug", Total: 40 ,totalday :"14"  , howmuch : 0},
  ]


  

  const handleView = (record) => {
    return(
        <div style={{display:'flex' , backgroundColor:"white"}}>
          <Tooltip
                    color="#dc5fc900"
                    style={{marginBottom:90}}
                    arrowPointAtCenter={true}
                    overlayStyle={{
                      backgroundColor: "white",
                      boxShadow: "0 0 0 0 white",        
                    }}
                    title={
                      <div
                        style={{
                          width: 211,
                          height: 114,
                          padding: 5,
                          marginTop: 15,
                          backgroundColor: "white",
                        }}
                      >
                        <Timeline
                        >
                          <Timeline.Item color="#DC5FC9">
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                height: 20,
                              }}
                            >
                              {/* {console.log("data   "+item.h1)} */}
                              {record.name}{" "}
                              <Statistic
                                //   title="Active"
                                value={11.28}
                                precision={2}
                                valueStyle={{
                                  color: "#0DA051",
                                  fontSize: 14,
                                  backgroundColor: "#ECFDF3",
                                  marginLeft: 10,
                                }}
                                // suffix="%"
                              />
                            </div>
                          </Timeline.Item>
                          <Timeline.Item color="#C1BCF1">
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                height: 20,
                              }}
                            >
                              Highest Result{" "}
                              <p style={{ marginTop: 0, marginLeft: 10 }}>{record.item_name}</p>
                            </div>
                          </Timeline.Item>
                          <Timeline.Item color="#FAA917">
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                height: 20,
                              }}
                            >
                              Average{" "}
                              <p style={{ marginTop: 0, marginLeft: 10 }}>{record.item_count}</p>
                            </div>
                          </Timeline.Item>
                        </Timeline>
                      </div>
                    }
                  >
                  </Tooltip>
      </div>
        )
    // navigate("/view-student", { state: { data } });

  };

 

 
  const dataSource = [
    {
      key: '1',
      user: 'Abreham Abebe',
      item_name: 'Excercisebook',
      item_count:100,
      Date: '03 Jun 2022',
    },
    {
        key: '2',
        user: 'Adera Tamirat',
        item_name: 'text book',
        item_count:25,
        Date: '13 Jun 2022',
    },
    {
        key: '3',
        user: 'Daniel Negus',
        item_name: 'pen',
        item_count: 90,
        Date: '23 Jan 2022',
    },
    {
        key: '4',
        user: 'Girum Tamirat',
        item_name: 'Pencil',
        item_count:78,
        Date: '19 Dec 2022',
    },
    {
        key: '5',
        user: 'Nahom Abebe',
        item_name: 'Binder',
        item_count:58,
        Date: '19 Nov 2022',
    },
  ];

  const items = [
    {
      lable:'Edit',
      value: 'Edit'
    },
    {
      lable:'History',
      value: 'History'
    },
  ]

 
  const columnSupplier = [
    {
      title: (
        <div>
           <Select
                bordered={false}
                defaultValue="Company Name"
                // onChange={(e) => onSelect(e)}
                className="w-[40vh] text-[#344054] !font-[500] !font-jakarta text border-[#EAECF0] hover:border-[#EAECF0] !border-0 !rounded-[6px] border-[2px]"
              >
                <Option key={1} value={"all"}>
                  All
                </Option>
                <Option key={1} value={1}>
                  Parents
                </Option>
                <Option key={2} value={2}>
                  Teachers
                </Option>
              </Select>
      </div>
        // <p className="font-jakarta font-[500] text-[14px] text-[#344054] background-[#FFF]">
        //   User
        // </p>
      ),
      dataIndex: "user",
      key: "user",
      render: (item) => {
        return <h1 className="font-jakarta text-[#344054] !font-jakarta font-[500]">{item}</h1>;
      },
    },
    {
      title: <p className="font-jakarta text-[#98A2B3] text-[14px] font-[500]">Product</p>,
      key: "item_name",
      dataIndex: "item_name",
      render: (value) => {
        return <p className="font-jakarta text-[#344054] !font-jakarta font-[500]">{value}</p>;
      },
    },
    {
      title: <p className="font-jakarta  text-[#98A2B3] text-[14px] font-[500]">Contact Person</p>,
      dataIndex: "item_count",
      key: "item_count",
      render: (item) => {
        return <h1 className="font-jakarta text-[#344054] !font-jakarta font-[500]">{item}</h1>;
      },
    },
    {
      title: <p className="font-jakarta text-[#98A2B3] text-[14px] font-[500]">Bank</p>,
      dataIndex: "Date",
      key: "Date",
      render: (item) => {
        return <h1 className="font-jakarta text-[#344054] !font-jakarta font-[500]">{item}</h1>;
      },
    },
    {
      title: <p className="font-jakarta  text-[#98A2B3] text-[14px] font-[500]">Bank account</p>,
      dataIndex: "item_count",
      key: "item_count",
      render: (item) => {
        return <h1 className="font-jakarta text-[#344054] !font-jakarta font-[500]">{item}</h1>;
      },
    },
    {
        title: '',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: (record ) => 
       <div>
         <Select
            bordered={false}
            showArrow={false}
            className="!rounded-[6px] border-[#EAECF0] border-[0px] text-[#344054] !font-jakarta font-[500] "
            style={{ width: 80 }}
            placeholder="..."
            onChange={handleEdit}
          >
            {/* <Option style={{color:'#344054',fontSize:14, }}value="Edit">Edit</Option>
            <Option style={{color:'#344054'}} value="History">History</Option> */}
            {items?.map((item, i) => (
              <Option key={item.key} value={item.value} lable={item.lable}>
                {item.lable}
              </Option>
            ))}
          </Select>
       </div>
        ,
      },
  ];

 
 
  const handleEdit = async ( value , record) =>{
    //  console.log("record: " + record)
    // console.log("value: " + value)
    console.log("worst  ",record.user)
      if(value == "Edit"){
        // 
        setEditSupply(true)
        setDatarecord(record);
      }
      if(value == "History"){
        setHistorySupply(true);
        setDatarecord(record);
        //  handleViewSupply(record)
      }
  }


  const Dates =[
    {
      id:1,
      label:
      <div 
      style={{display:"flex"}}
      >
      <div style={{
        display: "block"
      }}>
      </div>
      <span style={{marginLeft:10 }}>Daily</span>
      </div>,
      value:"Daily"
    } ,
    {
      id:2,
      label:
      <div 
      style={{display:"flex"}}
      >
      <div style={{
        display: "block"
      }}>
      </div>
      <span style={{marginLeft:10 }}>Weekly</span>
      </div>,
      value:"Weekly"
    } ,
    {
      id:3,
      label:
      <div 
      style={{display:"flex"}}
      >
      <div style={{
        display: "block"
      }}>
      </div>
      <span style={{marginLeft:10 }}>Monthly</span>
      </div>,
      value:"Monthly"
    } ,
    {
      id:4,
      label:
      <div 
      style={{display:"flex"}}
      >
      <div style={{
        display: "block"
      }}>
      </div>
      <span style={{marginLeft:10 }}>Annually</span>
      </div>,
      value:"Annually"
    }]

    const studentss =[
      {
        id:1,
        label:
        <div 
        style={{display:"flex"}}
        >
        <span >Inventory</span>
        </div>,
        value:"Inventory"
      } ,
      {
        id:2,
        label:
        <div 
        style={{display:"flex"}}
        >
        <span >Inventory</span>
        </div>,
        value:"Inventory"
      } ,
     ]
  const columns = [
    {
      title: (
        <div>
           <Select
                bordered={false}
                defaultValue="User"
                // onChange={(e) => onSelect(e)}
                className="w-[20vh] text-[#344054] !font-[500] !font-jakarta text border-[#EAECF0] hover:border-[#EAECF0] !border-0 !rounded-[6px] border-[2px]"
              >
                <Option key={1} value={"all"}>
                  All
                </Option>
                <Option key={1} value={1}>
                  Parents
                </Option>
                <Option key={2} value={2}>
                  Teachers
                </Option>
              </Select>
      </div>
        // <p className="font-jakarta font-[500] text-[14px] text-[#344054] background-[#FFF]">
        //   User
        // </p>
      ),
      // filters: [
      //   {
      //     text: 'Abreham Abebe',
      //     value: 'Abreham Abebe',
      //   },
      //   {
      //     text: 'Adera Tamirat',
      //     value: 'Adera Tamirat',
      //   },
      //   {
      //     text: 'Daniel negus',
      //     value: 'Daniel negus',
      //     children: [
      //       {
      //         text: 'pen',
      //         value: 'pen',
      //       },
      //       {
      //         text: 'pencil',
      //         value: 'pencil',
      //       },
      //     ],
      //   },
      // ],
      // // specify the condition of filtering result
      // // here is that finding the name started with `value`
      // onFilter: (value, record) => record.name.indexOf(value) === 0,
      // sorter: (a, b) => a.name- b.name,
      // sortDirections: ['descend'],
    
      dataIndex: "user",
      key: "user",
      render: (item) => {
        return <h1 className="font-jakarta text-[#344054] !font-jakarta font-[500]">{item}</h1>;
      },
    },
    {
      title: <p className="font-jakarta text-[#98A2B3] text-[14px] font-[500]">Item Name</p>,
      key: "item_name",
      dataIndex: "item_name",
      render: (value) => {
        return <p className="font-jakarta text-[#344054] !font-jakarta font-[500]">{value}</p>;
      },
    },
    {
      title: <p className="font-jakarta  text-[#98A2B3] text-[14px] font-[500]">Item Count</p>,
      dataIndex: "item_count",
      key: "item_count",
      render: (item) => {
        return <h1 className="font-jakarta text-[#344054] !font-jakarta font-[500]">{item}</h1>;
      },
    },
    {
      title: <p className="font-jakarta text-[#98A2B3] text-[14px] font-[500]">Date</p>,
      dataIndex: "Date",
      key: "Date",
      render: (item) => {
        return <h1 className="font-jakarta text-[#344054] !font-jakarta font-[500]">{item}</h1>;
      },
    },
    {
        title: '',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: (record ) => {
      return (
       <div>
         <Select
            bordered={false}
            showArrow={false}
            className="!rounded-[6px] border-[#EAECF0] border-[0px] text-[#344054] !font-jakarta font-[500] "
            style={{ width: 80 }}
            placeholder="..."
            onChange={handleEdit(record)}
            // onChange={handleFilterSection}
          >
            {/* <Option style={{color:'#344054',fontSize:14, }}value="Edit" >Edit</Option>
            <Option style={{color:'red'}} value="Remove">Remove</Option> */}
            {classes?.map((item, i) => (
              <Option key={item.key} value={item.section} lable={item.section}>
                {item.section}
              </Option>
            ))}
            
          </Select>
       </div>
      )},
    }
 
  ];


  const columnsProduct = [
    {
      title: (
        <div>
           <Select
                bordered={false}
                defaultValue="Name"
                // onChange={(e) => onSelect(e)}
                className="w-[20vh] text-[#344054] !font-[500] !font-jakarta text border-[#EAECF0] hover:border-[#EAECF0] !border-0 !rounded-[6px] border-[2px]"
              >
                <Option key={1} value={"all"}>
                  All
                </Option>
                <Option key={1} value={1}>
                  Parents
                </Option>
                <Option key={2} value={2}>
                  Teachers
                </Option>
              </Select>
      </div>
        // <p className="font-jakarta font-[500] text-[14px] text-[#344054] background-[#FFF]">
        //   User
        // </p>
      ),
      // filters: [
      //   {
      //     text: 'Abreham Abebe',
      //     value: 'Abreham Abebe',
      //   },
      //   {
      //     text: 'Adera Tamirat',
      //     value: 'Adera Tamirat',
      //   },
      //   {
      //     text: 'Daniel negus',
      //     value: 'Daniel negus',
      //     children: [
      //       {
      //         text: 'pen',
      //         value: 'pen',
      //       },
      //       {
      //         text: 'pencil',
      //         value: 'pencil',
      //       },
      //     ],
      //   },
      // ],
      // // specify the condition of filtering result
      // // here is that finding the name started with `value`
      // onFilter: (value, record) => record.name.indexOf(value) === 0,
      // sorter: (a, b) => a.name- b.name,
      // sortDirections: ['descend'],
    
      dataIndex: "user",
      key: "user",
      render: (item) => {
        return <h1 className="font-jakarta text-[#344054] !font-jakarta font-[500]">{item}</h1>;
      },
    },
    {
      title: <p className="font-jakarta text-[#98A2B3] text-[14px] font-[500]">Description</p>,
      key: "item_name",
      dataIndex: "item_name",
      render: (value) => {
        return <p className="font-jakarta text-[#344054] !font-jakarta font-[500]">{value}</p>;
      },
    },
    {
      title: <p className="font-jakarta  text-[#98A2B3] text-[14px] font-[500]">Item Count</p>,
      dataIndex: "item_count",
      key: "item_count",
      render: (item) => {
        return <h1 className="font-jakarta text-[#344054] !font-jakarta font-[500]">{item}</h1>;
      },
    },
    {
      title: <p className="font-jakarta text-[#98A2B3] text-[14px] font-[500]">Price/Uint</p>,
      dataIndex: "Date",
      key: "Date",
      render: (item) => {
        return <h1 className="font-jakarta text-[#344054] !font-jakarta font-[500]">{item}</h1>;
      },
    },
    {
        title: '',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: (record ) => {
      return (
       <div style={{ display:'flex' }}>
        <Button
        className="text-[#344054] !font-jakarta" 
        style={{ backgroundColor:'#F2F4F7', borderRadius:15}}>Update</Button>
         <Select
            bordered={false}
            showArrow={false}
            className="!rounded-[6px] border-[#EAECF0] border-[0px] text-[#344054] !font-jakarta font-[500] "
            style={{ width: 80 }}
            placeholder="..."
            onChange={handleEdit(record)}
            // onChange={handleFilterSection}
          >
            {/* <Option style={{color:'#344054',fontSize:14, }}value="Edit" >Edit</Option>
            <Option style={{color:'red'}} value="Remove">Remove</Option> */}
            {classes?.map((item, i) => (
              <Option key={item.key} value={item.section} lable={item.section}>
                {item.section}
              </Option>
            ))}
            
          </Select>
       </div>
      )},
    }
 
  ];



  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  const add = () => {
    setOpen(true);
  };

  const addsupplier =() =>{
    setOpenSupplier(true)
  }

//   useEffect(() => {
//     getStudents();
//   }, []);

  return (
    <div className="bg-[#FFF] -mt-14">
      <div className="list-header mb-2">
        <h1 className="text-2xl  font-[600] font-jakarta">Inventory</h1>
      </div>
      <div className="tab-content">
        <Tabs defaultActiveKey="0" 
         style={{ outline : "none" }}
        >
          <Tabs.TabPane
          
            tab={
              <span className="text-base  text-center font-[500] font-jakarta" 
              >
                Checkouts
              </span>
            }
            key="0"
          >   <Button
              className="btn-confirm  !text-[#FFF] -mt-20 hover:!bg-[#FFF] "
              style={{ backgroundColor : "#DC5FC9"}}
              onClick={() => add()}
            //   onClick={handleUpdate}
            >
              Create Order
            </Button>
      <div className="list-sub mb-10">
      <div className="course-search">
          <div>
            <Input
              style={{ width: 200 }}
              size="large"
              className="mr-3 !rounded-[6px] !border-[#FFF] hover:!shadow-[none]"
              placeholder=" Search"
              //onSearch={onSearch}
              prefix={<SearchOutlined className="site-form-item-icon "  size={60}/>}
            />
          </div>
        </div>
        <div className="list-filter">
        <RangePicker  
       format={'YYYY-MM-DD'}
       className="!mr-2 !rounded-lg  !border-0 hover:!border-0 !text-[#98A2B3] !shadow-none hover:!shadow-none"
    //   onChange={(e) =>handledata(e)}
       />
          <Select
            bordered={false}
            className="!rounded-[6px] border-[#EAECF0] border-[0px]"
            style={{ width: 150 }}
            placeholder="All Catagory"
            // onChange={handleFilterSection}
          >
            {classes?.map((item, i) => (
              <Option key={item.key} value={item.section} lable={item.section}>
                {item.section}
              </Option>
            ))}
          </Select>
        </div>
      
      </div>

      <Table
        className="bg-[#FFFFFF]"
        // onRow={(record, rowIndex) => {
        //   return {
        //     onClick: (event) => handleView(record), // click row
        //   };
        // }}

        // loading={loading}
        style={{ marginTop: 20, backgroundColor:'#FFF'}}
        columns={columns}
        dataSource={dataSource}
        
        pagination={{ position: ["bottomCenter"] }}
      />

     <CreateNewInventory
        open={open}
        setOpen={setOpen}
      />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <span className="text-base font-[500] text-center  font-jakarta">
                Product
              </span>
            }
            key="1"
          >
              <div className=" ml-4">
          <div style={{display:"flex" ,}}>
       <RangePicker  
       format={'YYYY-MM-DD'}
       className="!mr-2 !rounded-lg  !border-0 hover:!border-0 !text-[#98A2B3] !shadow-none hover:!shadow-none"
      // onChange={(e) =>handledata(e)}
       />
<Select
      defaultValue={Dates[0]}
      // placeholder={Genders[2]}  
      options={Dates}
    styles={{
      control: base => ({
        ...base,
        border: 0,
        // This line disable the blue border
        boxShadow: 'none',
        color:"#98A2B3"
      }),
      option: (baseStyles, state) => ({
        ...baseStyles,
        color: state.isSelected ? '#DC5FC9' : '#344054',
        fontSize:14,
        fontWeight:'bold',
        backgroundColor :"#FFF",
        borderColor :"white",
        borderWidth:0,
        borderRadius:15,
        width:'50%',
      }),
      }}
      theme={(theme) => ({
        ...theme,
        borderRadius: 0,
        colors: {
          text: '#98A2B3',
          font:'#3599B8',
          primary25: '#FFF',
          primary: '#FFF',
          color: '#98A2B3',
        },
      })}
      className="!mr-2 !rounded-lg  !border-0 hover:!border-0 !text-[#667085]"
/>
</div>
</div>
      <Grid item xs={12} sm={12} md={12}>
          <Card bordered={false} className="w-[100%] mb-10" >
            <div className="flex flex-row justify-start align-bottom items-center">
                <Select
      defaultValue={studentss[0]}
      options={studentss}
    styles={{
      control: base => ({
        ...base,
        border: 0,
        // This line disable the blue border
        boxShadow: 'none',
        color:"#344054",
        fontSize:16,
        zIndex:0,
        opaacity:1
      }),
      option: (baseStyles, state) => ({
        ...baseStyles,
        color: state.isSelected ? '#DC5FC9' : '#344054',
        fontSize:14,
        fontWeight:'bold',
        backgroundColor :"#FFF",
        borderColor :"white",
        borderWidth:0,
        width: "100%",
        opaacity:1
      }),
      }}
      theme={(theme) => ({
        ...theme,
        borderRadius: 0,
        colors: {
          primary25: '#FFF',
          primary: '#FFF',
          color: '#98A2B3',
          opaacity:1
        },
      })}
      className="!ml-[-10px] !rounded-lg !border-0 hover:!border-0 !text-[#667085]"
/>

            </div>
            <div className="flex flex-row justify-start align-bottom items-center mt-4">
            <h1 className="text-3xl text-[#344054] ">
             5417</h1>
                <FontAwesomeIcon className="pr-2  mb-2 ml-5 text-[#0ceb20]" icon={faArrowUp} />
                <h4 className="text-sm text-[#0ceb20]" style={{marginLeft:-4}}>8%</h4>
                </div>
            <div className="flex" >
                  <ChartStudent title="" aspect={4 /1} datas = {datas} />
                  </div>

          </Card>
        </Grid>
        <div className="course-search mt-10">
          <div>
            <Input
              style={{ width: 200 }}
              size="large"
              className="mr-3 !rounded-[6px] !border-[#FFF] hover:!shadow-[none]"
              placeholder=" Search"
              //onSearch={onSearch}
              prefix={<SearchOutlined className="site-form-item-icon "  size={60}/>}
            />
          </div>
        </div>
        <Table
        className="bg-[#FFFFFF]"
        // onRow={(record, rowIndex) => {
        //   return {
        //     onClick: (event) => handleView(record), // click row
        //   };
        // }}

        // loading={loading}
        style={{ marginTop: 20, backgroundColor:'#FFF'}}
        columns={columnsProduct}
        dataSource={dataSource}
        
        pagination={{ position: ["bottomCenter"] }}
      />

        </Tabs.TabPane>
        <Tabs.TabPane
            tab={
              <span className="text-base font-[500] text-center  font-jakarta">
                Suppliers
              </span>
            }
            key="2"
          >
             <Button
              className="btn-confirm  !text-[#FFF] -mt-20 hover:!bg-[#FFF] "
              style={{ backgroundColor : "#DC5FC9"}}
              onClick={() => addsupplier()}
            //   onClick={handleUpdate}
            >
              Create Supplier
            </Button>
      <div className="list-sub mb-10">
      <div className="course-search">
          <div>
            <Input
              style={{ width: 200 }}
              size="large"
              className="mr-3 !rounded-[6px] !border-[#FFF] hover:!shadow-[none]"
              placeholder=" Search"
              //onSearch={onSearch}
              prefix={<SearchOutlined className="site-form-item-icon "  size={60}/>}
            />
          </div>
        </div>
      </div>
   


      <Table
        className="bg-[#FFFFFF]"
        // onRow={(record, rowIndex) => {
        //   return {
        //     onClick: (event) => handleView(record), // click row
        //   };
        // }}

        // loading={loading}
        style={{ marginTop: 20, backgroundColor:'#FFF'}}
        columns={columnSupplier}
        dataSource={dataSource}
        
        pagination={{ position: ["bottomCenter"] }}
      />

     <CreateNewSupplier
        open={openSupplier}
        setOpen={setOpenSupplier}
      />
         <EditSupplier 
        open={EditSupply}
        setOpen={setEditSupply}
        data={datarecord}
      />
       
       <HistorySupplier 
       open={HistorySupply}
       setOpen={setHistorySupply}
       data={datarecord}
       />
        </Tabs.TabPane>
        </Tabs>
      </div>
      </div>
  );
}
