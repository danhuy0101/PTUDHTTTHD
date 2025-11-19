import { useState, useEffect, useMemo } from "react";
import { api } from "./api";
import "./App.css";

const FILTER_ALL = "all";
const FILTER_IN_PROGRESS = "in-progress";
const FILTER_COMPLETED = "completed";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState(FILTER_ALL);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editStatus, setEditStatus] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState(null);

  const load = async () => {
    const res = await api.get("/");
    setTasks(res.data);
  };

  const addTask = async () => {
    if (!title.trim()) return;

    await api.post("/", {
      title,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      isCompleted: false,
    });

    setTitle("");
    setDueDate("");
    load();
  };

  const openDeleteModal = (id) => {
    setDeleteTaskId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    await api.delete(`/${deleteTaskId}`);
    setShowDeleteModal(false);
    load();
  };

  const openEditModal = (task) => {
    setEditTaskId(task.id);
    setEditTitle(task.title);
    setEditDueDate(task.dueDate?.substring(0, 10) || "");
    setEditStatus(task.isCompleted ? "completed" : "in-progress");
    setShowEditModal(true);
  };

  const saveEdit = async () => {
    await api.put(`/${editTaskId}`, {
      title: editTitle,
      dueDate: editDueDate ? new Date(editDueDate).toISOString() : null,
      isCompleted: editStatus === "completed",
    });

    setShowEditModal(false);
    load();
  };

  const filteredTasks = useMemo(() => {
    if (filter === FILTER_ALL) return tasks;
    return tasks.filter((t) =>
      filter === FILTER_COMPLETED ? t.isCompleted : !t.isCompleted
    );
  }, [tasks, filter]);

  const formatDate = (d) => {
    if (!d) return "—";
    const date = new Date(d);
    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="app-container">
      <div className="task-manager-card">
        <h1 className="card-title">Màn hình quản lý task cá nhân</h1>

        {}
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

          <button className="add-button" onClick={addTask}>
            Add
          </button>
        </div>

        {}
        <select
          className="filter-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value={FILTER_ALL}>Tất cả</option>
          <option value={FILTER_IN_PROGRESS}>Đang làm</option>
          <option value={FILTER_COMPLETED}>Hoàn thành</option>
        </select>

        {}
        <div className="task-list-container">
          <div className="task-header">
            <div className="task-col">Task</div>
            <div className="due-date-col">Due-date</div>
            <div className="status-col">Status</div>
            <div className="action-col"></div>
          </div>

          <ul className="task-list">
            {filteredTasks.map((t) => (
              <li key={t.id} className="task-item">

                {}
                <span className="task-title-display task-col">
                  {t.title}
                </span>

                <span className="task-date-display due-date-col">
                  {formatDate(t.dueDate)}
                </span>

                {}
                <button
                  className={`task-status ${
                    t.isCompleted ? "completed" : "in-progress"
                  }`}
                  onClick={() => openEditModal(t)}
                >
                  {t.isCompleted ? "Hoàn thành" : "Đang làm"}
                </button>

                <div className="task-actions action-col">
                  <button className="action-icon edit-icon" onClick={() => openEditModal(t)}>
                    ✎
                  </button>

                  <button
                    className="action-icon delete-icon"
                    onClick={() => openDeleteModal(t.id)}
                  >
                    🗑
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Edit Task</h2>

            <input
              className="modal-input"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />

            <input
              className="modal-input"
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
            />

            <select
              className={`status-dropdown ${editStatus}`}
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
            >
              <option value="in-progress">Đang làm</option>
              <option value="completed">Hoàn thành</option>
            </select>

            <div className="modal-actions">
              <button className="save-btn" onClick={saveEdit}>
                Lưu
              </button>
              <button className="cancel-btn" onClick={() => setShowEditModal(false)}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Xóa Task</h2>
            <p>Bạn có chắc chắn muốn xóa task này?</p>

            <div className="modal-actions">
              <button className="save-btn" onClick={confirmDelete}>
                Xóa
              </button>
              <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
