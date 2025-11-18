import { useState, useEffect, useMemo } from "react";
import { api } from "./api";
import "./App.css";

// Khởi tạo trạng thái lọc mặc định là 'all'
const FILTER_ALL = 'all'; 
const FILTER_IN_PROGRESS = 'in-progress';
const FILTER_COMPLETED = 'completed';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState(FILTER_ALL); // State mới cho chức năng lọc

  // --- HÀM XỬ LÝ API ---

  // Load tất cả task từ backend
  const load = async () => {
    try {
      const res = await api.get("/");
      if (Array.isArray(res.data)) {
        setTasks(res.data);
      } else {
        console.error("Data from API is not an array:", res.data);
      }
    } catch (error) {
      // In chi tiết lỗi response từ server nếu có
      console.error("Lỗi khi tải tasks:", error.response || error); 
    }
  };

  // Thêm task mới
  const addTask = async () => {
    if (!title.trim()) return;

    // Chuẩn hóa dữ liệu ngày: type="date" trả về YYYY-MM-DD. 
    // Dùng .toISOString() để gửi định dạng chuẩn tới Backend.
    const taskDueDate = dueDate ? new Date(dueDate).toISOString() : null; 
    
    const newTask = {
      title: title.trim(),
      dueDate: taskDueDate,
      isCompleted: false,
    };

    try {
      await api.post("/", newTask);
      setTitle("");
      setDueDate("");
      load(); // Tải lại danh sách sau khi thêm thành công
    } catch (error) {
      console.error("Lỗi khi thêm task:", error.response || error);
      alert("Lỗi khi thêm task! Vui lòng kiểm tra console.");
    }
  };

  // Toggle trạng thái hoàn thành
  const toggle = async (task) => {
    try {
      // Đảm bảo chỉ gửi các trường cần thiết để cập nhật
      const updatedTaskData = {
        ...task,
        isCompleted: !task.isCompleted,
      };
      await api.put(`/${task.id}`, updatedTaskData);
      load();
    } catch (error) {
      console.error("Lỗi khi chuyển trạng thái:", error.response || error);
    }
  };

  // Xóa task
  const remove = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa task này?")) return;
    try {
      await api.delete(`/${id}`);
      load();
    } catch (error) {
      console.error("Lỗi khi xóa task:", error.response || error);
    }
  };

  // --- LOGIC HIỂN THỊ VÀ LỌC ---

  // Hàm lọc (sử dụng useMemo để tối ưu hiệu suất)
  const filteredTasks = useMemo(() => {
    if (filter === FILTER_ALL) {
      return tasks;
    }
    const isCompletedFilter = filter === FILTER_COMPLETED;
    return tasks.filter(t => t.isCompleted === isCompletedFilter);
  }, [tasks, filter]); // Chỉ tính toán lại khi tasks hoặc filter thay đổi

  // Format ngày hiển thị (DD/MM/YYYY)
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      const d = new Date(dateString);
      // Kiểm tra xem ngày có hợp lệ không
      if (isNaN(d)) return "—"; 
      
      const day = d.getDate().toString().padStart(2, "0");
      const month = (d.getMonth() + 1).toString().padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (e) {
      console.error("Lỗi format ngày:", e);
      return "—";
    }
  };

  useEffect(() => {
    load();
  }, []); // Load dữ liệu khi component được mount

  // --- RENDER GIAO DIỆN ---

  return (
    <div className="app-container">
      <div className="task-manager-card">
        <h1 className="card-title">Màn hình quản lý task cá nhân</h1>

        {/* Input và Button Add */}
        <div className="input-group">
          <input
            className="task-input"
            placeholder="Task"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="due-date-input"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <button 
            className="add-button" 
            onClick={addTask} 
            disabled={!title.trim()} // Vô hiệu hóa nút nếu task rỗng
          >
            Add
          </button>
        </div>

        {/* Dropdown Lọc */}
        <div className="filter-dropdown">
          <select 
            className="filter-select" 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value={FILTER_ALL}>Tất cả</option>
            <option value={FILTER_IN_PROGRESS}>Đang làm</option>
            <option value={FILTER_COMPLETED}>Hoàn thành</option>
          </select>
        </div>

        {/* Danh sách Task */}
        <div className="task-list-container">
          <div className="task-header">
            <div className="header-item task-col">Task</div>
            <div className="header-item due-date-col">Due-date</div>
            <div className="header-item status-col">Status</div>
            <div className="header-item action-col"></div>
          </div>

          <ul className="task-list">
            {filteredTasks.length > 0 ? (
                filteredTasks.map((t) => (
                  <li key={t.id} className={`task-item ${t.isCompleted ? 'completed-row' : ''}`}>
                    
                    {/* Task Title (click để toggle) */}
                    <button
                      className={`task-title-display task-col ${t.isCompleted ? 'completed' : ''}`}
                      onClick={() => toggle(t)}
                      title="Nhấn để chuyển trạng thái"
                    >
                      {t.title}
                    </button>

                    {/* Due Date */}
                    <span className="task-date-display due-date-col">
                      {formatDate(t.dueDate)}
                    </span>

                    {/* Status */}
                    <span
                      className={`task-status status-col ${
                        t.isCompleted ? "completed" : "in-progress"
                      }`}
                    >
                      {t.isCompleted ? "Hoàn thành" : "Đang làm"}
                    </span>

                    {/* Actions */}
                    <div className="task-actions action-col">
                      {/* Icon chỉnh sửa (chưa có logic, giữ lại cho giao diện) */}
                      <span className="action-icon edit-icon" title="Sửa">&#9998;</span> 
                      
                      {/* Button xóa */}
                      <button
                        className="action-icon delete-icon"
                        onClick={() => remove(t.id)}
                        title="Xóa task"
                      >
                        &#128465;
                      </button>
                    </div>
                  </li>
                ))
            ) : (
                <li className="no-tasks-message">Không có task nào.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}