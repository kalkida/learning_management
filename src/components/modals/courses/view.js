import { useNavigate, useLocation } from "react-router-dom";
import { Input, Button, Select, TimePicker, Tabs, Table } from "antd";
import moment from "moment";
import "./style.css";
import AttendanceList from "../../subComponents/AttendanceList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

const { Option } = Select;

function ViewCourse() {
  const { state } = useLocation();
  const { data } = state;

  const navigate = useNavigate();

  const columns = [
    {
      title: "Teachers",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "",
      dataIndex: "last_name",
      key: "last_name",
    },
  ];
  const handleUpdate = () => {
    navigate("/update-course", { state: { data } });
  };
  return (
    <div>
      <div className="flex flex-row justify-between">
        <div className="course-avater">
          <img src="logo512.png" alt="profile" />
          <div className="profile-info">
            <h2>{data.course_name}</h2>
            <h3>
              Grade {data.class ? data.class.level + data.class.section : ""}
            </h3>
          </div>
        </div>
        <div className="header-extra">
          <div>
            <h3>Assigned Teachers</h3>
            <h4>{data.teachers.length}</h4>
          </div>
          <div>
            <h3>Class/week</h3>
            <h4>{data.schedule.length}</h4>
          </div>
        </div>
      </div>
      <div className="tab-content">
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Profile" key="1">
            <Button
              icon={<FontAwesomeIcon className="pr-2" icon={faPen} />}
              className="btn-confirm"
              onClick={handleUpdate}
            >
              Edit Course
            </Button>
            <div className="course-description rounded-lg border-[2px]">
              <h4>Coures Description</h4>
              <Input.TextArea
                className="border-[1px] rounded-lg"
                width="100%"
                rows={4}
                defaultValue={data.description}
              />
            </div>
            <div className="text-xl">
              <h4 className="py-2">Assigned Teachers</h4>
              <Table
                className="p-2 bg-[#F9FAFB] rounded-lg border-[1px] border-[#D0D5DD]"
                dataSource={data.teachers}
                columns={columns}
              />
            </div>
            <div className="schedule">
              <h4 className="text-xl pt-2 ">Weekly Schedule</h4>
              <div className="card-schedule border-[2px]">
                <h2 className="text-lg py-2">
                  Class{" "}
                  {data.class ? data.class.level + data.class.section : ""}
                </h2>
                <div className="flex flex-row justify-between">
                  <div className="border-[2px] w-[100%] p-2 text-center rounded-lg border-[#E7752B]">
                    <p> Period</p>
                  </div>
                  <div className="border-t-[2px] border-b-[2px] w-[100%] p-2 text-center rounded-lg border-[#E7752B]">
                    <p> Start time</p>
                  </div>

                  <div className="border-[2px] w-[100%] p-2 text-center rounded-lg border-[#E7752B]">
                    <p> End time</p>
                  </div>
                </div>
                {data.schedule?.map((item) => (
                  <div className="border-[#E7752B] border-[2px] my-2 rounded-lg">
                    <Input
                      className="rounded-lg border-[0px]"
                      value={item.day}
                      style={{ width: "33%" }}
                    />
                    <TimePicker.RangePicker
                      style={{ width: "67%" }}
                      className="rounded-lg border-[0px]"
                      use12Hours
                      format={"hh:mm"}
                      value={
                        item.time?.length
                          ? [
                              moment(JSON.parse(item?.time[0])),
                              moment(JSON.parse(item?.time[1])),
                            ]
                          : []
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Attendance" key="2">
            <AttendanceList />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Assignment" key="3">
            Content of Tab Pane 3
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default ViewCourse;
