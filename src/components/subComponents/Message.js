import React from 'react'
import { SearchOutlined, SendOutlined } from "@ant-design/icons";
import { Input, Tabs } from "antd";
import profile from "../../assets/clip6.png"
import profile1 from "../../assets/clip1.png"
import profile2 from "../../assets/clip3.png"

function Message() {
    return (
        <div className="bg-[#F9FAFB] h-[94vh] -mt-14">
            <div className="list-header mb-5">
                <h1 className="text-2xl font-[600] font-jakarta">Message </h1>
            </div>
            <div className="list-sub mb-10 flex flex-col md:flex-row">
                <div className='w-[100%] md:w-[30%]  px-2'>
                    <Input
                        style={{
                            width: "100%",
                            border: "none"
                        }}
                        className="mr-3 rounded-lg"
                        placeholder="Search people by name"
                        //   onChange={onSearch}
                        prefix={<SearchOutlined className="site-form-item-icon" />}
                    />
                    <div>
                        <Tabs defaultActiveKey="1">
                            <Tabs.TabPane
                                tab={<span className="text-base  text-center font-[400] font-jakarta">All</span>}
                                key="0"
                            >
                                <div className='flex justify-between py-2 px-4 bg-[#FCF2FB] rounded-lg mb-2'>
                                    <div className='flex items-center'>
                                        <div className='w-10 h-10 border-2 rounded-3xl border-[#dc5fc9] mr-2'>
                                            <img src={profile} alt='profile' />
                                        </div>
                                        <div >
                                            <h1>Merone Michael</h1>
                                            <p className='mb-0 text-[#dc5fc9] text-[12px] truncate'>You: Thankyou for your...</p>
                                        </div>
                                    </div>

                                    <div>
                                        <span className='text-[#dc5fc9] text-[12px]'>2 min</span>
                                    </div>
                                </div>
                                <div className='flex justify-between py-2 px-4 rounded-lg mb-2'>
                                    <div className='flex items-center'>
                                        <div className='w-10 h-10 border-2 rounded-3xl border-[#667085] mr-2'>
                                            <img src={profile1} alt='profile' />
                                        </div>
                                        <div >
                                            <h1>Solomon Abebe</h1>
                                            <p className='mb-0 text-[#667085] text-[12px] truncate'>Ofcourse have agood day</p>
                                        </div>
                                    </div>

                                    <div>
                                        <span className='text-[#667085] text-[12px]'>30 min</span>
                                    </div>
                                </div>
                                <div className='flex justify-between py-2 px-4  rounded-lg mb-2'>
                                    <div className='flex items-center'>
                                        <div className='w-10 h-10 border-2 rounded-3xl border-[#667085] mr-2'>
                                            <img src={profile2} alt='profile' />
                                        </div>
                                        <div >
                                            <h1>Adonay Kebede</h1>
                                            <p className='mb-0 text-[#667085] text-[12px] truncate'>Typing  </p>
                                        </div>
                                    </div>

                                    <div>
                                        <span className='text-[#667085] text-[12px]'>12 hour</span>
                                    </div>
                                </div>
                                <div className='flex justify-between py-2 px-4  rounded-lg mb-2'>
                                    <div className='flex items-center'>
                                        <div className='w-10 h-10 border-2 rounded-3xl border-[#667085] mr-2'>
                                            <img src={profile2} alt='profile' />
                                        </div>
                                        <div >
                                            <h1>Samson Wendesen</h1>
                                            <p className='mb-0 text-[#667085] text-[12px] truncate'>I have a quation for you</p>
                                        </div>
                                    </div>

                                    <div>
                                        <span className='text-[#667085] text-[12px]'>12 hour</span>
                                    </div>
                                </div>
                            </Tabs.TabPane>
                            <Tabs.TabPane
                                tab={<span className="text-base  text-center font-[400] font-jakarta">Parent</span>}
                                key="1"
                            >
                                <div className='flex justify-between py-2 px-4 bg-[#FCF2FB] rounded-lg mb-2'>
                                    <div className='flex items-center'>
                                        <div className='w-10 h-10 border-2 rounded-3xl border-[#dc5fc9] mr-2'>
                                            <img src={profile} alt='profile' />
                                        </div>
                                        <div >
                                            <h1>Merone Michael</h1>
                                            <p className='mb-0 text-[#dc5fc9] text-[12px] truncate'>You: Thankyou for your...</p>
                                        </div>
                                    </div>

                                    <div>
                                        <span className='text-[#dc5fc9] text-[12px]'>2 min</span>
                                    </div>
                                </div>
                                <div className='flex justify-between py-2 px-4 rounded-lg mb-2'>
                                    <div className='flex items-center'>
                                        <div className='w-10 h-10 border-2 rounded-3xl border-[#667085] mr-2'>
                                            <img src={profile1} alt='profile' />
                                        </div>
                                        <div >
                                            <h1>Solomon Abebe</h1>
                                            <p className='mb-0 text-[#667085] text-[12px] truncate'>Ofcourse have agood day</p>
                                        </div>
                                    </div>

                                    <div>
                                        <span className='text-[#667085] text-[12px]'>30 min</span>
                                    </div>
                                </div>
                                <div className='flex justify-between py-2 px-4  rounded-lg mb-2'>
                                    <div className='flex items-center'>
                                        <div className='w-10 h-10 border-2 rounded-3xl border-[#667085] mr-2'>
                                            <img src={profile2} alt='profile' />
                                        </div>
                                        <div >
                                            <h1>Adonay Kebede</h1>
                                            <p className='mb-0 text-[#667085] text-[12px] truncate'>Typing...</p>
                                        </div>
                                    </div>

                                    <div>
                                        <span className='text-[#667085] text-[12px]'>12 hour</span>
                                    </div>
                                </div>
                            </Tabs.TabPane>
                            <Tabs.TabPane
                                tab={
                                    <span className="text-base  text-center font-[400] font-jakarta">
                                        Teacher
                                    </span>
                                }
                                key="2"
                            >
                                <div className='flex justify-between py-2 px-4  rounded-lg mb-2'>
                                    <div className='flex items-center'>
                                        <div className='w-10 h-10 border-2 rounded-3xl border-[#667085] mr-2'>
                                            <img src={profile2} alt='profile' />
                                        </div>
                                        <div >
                                            <h1>Samson Wendesen</h1>
                                            <p className='mb-0 text-[#667085] text-[12px] truncate'>I have a quation for you</p>
                                        </div>
                                    </div>

                                    <div>
                                        <span className='text-[#667085] text-[12px]'>12 hour</span>
                                    </div>
                                </div>
                            </Tabs.TabPane>
                        </Tabs>
                    </div>
                </div>
                <div className='w-[100%] md:w-[70%] border-2 bg-white rounded-xl h-[85vh] overflow-scroll'>
                    <div className='flex border-b-2 py-2 px-5 items-center top-0 sticky bg-white'>
                        <div className='w-10 h-10 border-2 rounded-3xl border-[#667085] mr-2'>
                            <img src={profile1} alt='profile' />
                        </div>
                        <h1 className='font-semibold'>Merone Michael</h1>
                    </div>
                    <div className='h-[100%] flex flex-col justify-end'>
                        <div className='mb-2 pr-5 w-[100%] flex flex-col place-items-end'>
                            <p className='mb-0 max-w-[70%] bg-[#FCF2FB] border-2 border-[#EA9FDF] rounded-br-none rounded-lg p-2'>Dear Meron’s parents, we would like to discuss about an upcoming project to help students’ learning process. Would be great if you could join us on Saturday, Oct 8 at 9AM at the school hall.</p>
                            <span className='text-[#98A2B3]'>3:02 PM</span>
                        </div>
                        <div className='mb-2 pl-5 w-[100%] flex flex-col place-items-start'>
                            <p className='mb-0 max-w-[70%] bg-[#FFFFFF] border-2 border-[#D0D5DD] rounded-bl-none rounded-lg p-2'>Of course, I wil be there.</p>
                            <span className='text-[#98A2B3]'>3:02 PM</span>
                        </div>
                        <div className='mb-2 pr-5 w-[100%] flex flex-col place-items-end'>
                            <p className='mb-0 max-w-[70%] bg-[#FCF2FB] border-2 border-[#EA9FDF] rounded-br-none rounded-lg p-2'>Thank you for your time.</p>
                            <span className='text-[#98A2B3]'>3:02 PM</span>
                        </div>
                    </div>
                    <div className='px-5 my-5'>
                        <Input
                            style={{
                                width: "100%",
                                borderRadius: "8px",
                                borderWidth: 2,
                                borderColor: "#D0D5DD"
                            }}
                            className="mr-3 border-[#EAECF0] rounded-lg"
                            placeholder="Text Field"
                            //   onChange={onSearch}
                            suffix={<SendOutlined />}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Message