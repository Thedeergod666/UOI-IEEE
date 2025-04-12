

class Calendar {
  constructor() {
    // 绑定方法保持this上下文
    this.showEventDetails = this.showEventDetails.bind(this);
    this.handleCalendarClick = this.handleCalendarClick.bind(this);

    this.currentDate = new Date();
    this.selectedEvent = null;
    this.events = JSON.parse(localStorage.getItem("calendarEvents")) || [
      {
        id: 1,
        title: "技术研讨会",
        date: "2025-04-12",
        time: "14:00",
        location: "Room 301",
        status: "completed",
        description: "关于最新技术趋势的研讨会",
      },
      {
        id: 2,
        title: "AI讲座",
        date: "2025-04-15",
        time: "16:00",
        location: "Auditorium",
        status: "pending",
        description: "人工智能在工程中的应用",
      },
      {
        id: 3,
        title: "项目启动会",
        date: "2025-05-03",
        time: "09:30",
        location: "Conference Room",
        status: "pending",
        description: "新项目启动会议",
      },
    ];

    this.initElements();
    this.initEventListeners();
    this.renderCalendar();
  }

  initElements() {
    this.monthYearElement = document.getElementById("monthYear");
    this.calendarBody = document.getElementById("calendarBody");
    this.prevMonthBtn = document.getElementById("prevMonthBtn");
    this.nextMonthBtn = document.getElementById("nextMonthBtn");
    this.addEventBtn = document.getElementById("addEventBtn");
    this.eventModal = document.getElementById("eventModal");
    this.detailModal = document.getElementById("detailModal");
    this.closeModalBtns = document.querySelectorAll(".close-btn");
    this.eventForm = document.getElementById("eventForm");
    this.closeDetailBtn = document.getElementById("closeDetailBtn");
    this.editEventBtn = document.getElementById("editEventBtn");
    this.confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  }

  initEventListeners() {
    // 控制按钮
    this.prevMonthBtn.addEventListener("click", () => this.changeMonth(-1));
    this.nextMonthBtn.addEventListener("click", () => this.changeMonth(1));
    this.addEventBtn.addEventListener("click", () => this.openModal());

    // 模态框关闭
    this.closeModalBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.closeModal();
        this.closeDetailModal();
      });
    });

    // 表单提交
    this.eventForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleFormSubmit(e);
    });

    // 详情模态框按钮
    this.closeDetailBtn.addEventListener("click", () =>
      this.closeDetailModal()
    );
    this.editEventBtn.addEventListener("click", () => this.editSelectedEvent());
    this.confirmDeleteBtn.addEventListener("click", () =>
      this.deleteSelectedEvent()
    );
    this.calendarBody.addEventListener("click", this.handleCalendarClick);

    // 使用事件委托处理日历事件点击
    this.calendarBody.addEventListener("click", (e) => {
      const eventElement = e.target.closest(".event");
      if (eventElement) {
        e.stopPropagation();
        const eventId = parseInt(eventElement.dataset.id);
        this.showEventDetails(eventId);
      }
    });

    // 点击模态框外部关闭
    window.addEventListener("click", (e) => {
      if (e.target === this.eventModal) {
        this.closeModal();
      }
      if (e.target === this.detailModal) {
        this.closeDetailModal();
      }
    });
  }

  // 确保所有方法都有定义
  closeModal() {
    this.eventModal.style.display = "none";
    this.eventForm.reset();
  }

  closeDetailModal() {
    this.detailModal.style.display = "none";
  }

  editSelectedEvent() {
    if (!this.selectedEvent) return;
    
    this.closeDetailModal();
    this.openModal(this.selectedEvent);
}

  deleteSelectedEvent() {
    if (!this.selectedEvent) return;

    if (confirm(`确定要删除 "${this.selectedEvent.title}" 这个事件吗？`)) {
      this.events = this.events.filter((e) => e.id !== this.selectedEvent.id);
      this.saveEvents();
      this.renderCalendar();
      this.closeDetailModal();
      this.deselectEvent();
    }
  }

  renderCalendar() {
    this.calendarBody.innerHTML = "";
    this.updateMonthYearDisplay();

    const firstDayOfMonth = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      1
    );

    const lastDayOfMonth = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      0
    );

    const startDay =
      firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1;
    const totalDays = lastDayOfMonth.getDate();

    let date = 1;
    for (let i = 0; i < 6; i++) {
      if (date > totalDays) break;

      const row = document.createElement("tr");

      for (let j = 0; j < 7; j++) {
        const cell = document.createElement("td");

        if (i === 0 && j < startDay) {
          const prevMonthDays = new Date(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth(),
            0
          ).getDate();

          const prevDate = prevMonthDays - (startDay - j - 1);
          cell.innerHTML = `<div class="calendar-day other-month">${prevDate}</div>`;
          cell.classList.add("other-month-cell");
        } else if (date > totalDays) {
          const nextDate = date - totalDays;
          cell.innerHTML = `<div class="calendar-day other-month">${nextDate}</div>`;
          cell.classList.add("other-month-cell");
          date++;
        } else {
          const currentDate = new Date(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth(),
            date
          );

          cell.innerHTML = `
                        <div class="calendar-day">${date}</div>
                        ${this.renderEventsForDate(currentDate)}
                    `;

          if (currentDate.toDateString() === new Date().toDateString()) {
            cell.classList.add("today");
          }

          date++;
        }

        row.appendChild(cell);
      }

      this.calendarBody.appendChild(row);
    }
  }

  handleCalendarClick(e) {
    const eventElement = e.target.closest(".event");
    if (!eventElement) return;

    e.preventDefault();
    e.stopPropagation();

    const eventId = parseInt(eventElement.dataset.id);
    console.log("Event clicked, ID:", eventId); // 调试日志

    if (typeof this.showEventDetails === "function") {
      this.showEventDetails(eventId);
    } else {
      console.error("showEventDetails is not a function");
    }
  }

  showEventDetails(eventId) {
    console.log("Showing details for event:", eventId); // 调试日志
    const event = this.events.find((e) => e.id === eventId);
    if (!event) {
      console.error("Event not found:", eventId);
      return;
    }

    this.selectedEvent = event;

    // 确保这些元素存在
    const detailModal = document.getElementById("detailModal");
    if (!detailModal) {
      console.error("Detail modal element not found");
      return;
    }

    // 更新详情内容
    document.getElementById("detailTitle").textContent = event.title;
    document.getElementById("detailDate").textContent = event.date;
    document.getElementById("detailTime").textContent = event.time;
    document.getElementById("detailLocation").textContent = event.location;
    document.getElementById("detailStatus").textContent =
      event.status === "completed" ? "已完成" : "待进行";
    document.getElementById("detailDescription").textContent =
      event.description || "无描述";

    // 显示模态框
    detailModal.style.display = "block";
    console.log("Detail modal should be visible now");
  }

  renderEventsForDate(date) {
    const dateStr = this.formatDate(date);
    const dayEvents = this.events.filter((event) => event.date === dateStr);

    return dayEvents
      .map(
        (event) => `
            <div class="event event-${event.status}" data-id="${event.id}">
                <span class="event-marker"></span>
                ${event.title}
                <small>${event.time} @ ${event.location}</small>
            </div>
        `
      )
      .join("");
  }

  updateMonthYearDisplay() {
    this.monthYearElement.textContent = this.currentDate.toLocaleDateString(
      "zh-CN",
      {
        year: "numeric",
        month: "long",
      }
    );
  }

  changeMonth(offset) {
    this.currentDate.setMonth(this.currentDate.getMonth() + offset);
    this.renderCalendar();
  }

  openModal(eventToEdit = null) {
    // 重置表单
    this.eventForm.reset();
    
    // 如果是编辑模式
    if (eventToEdit) {
        document.getElementById('eventTitle').value = eventToEdit.title;
        document.getElementById('eventDate').value = eventToEdit.date;
        document.getElementById('eventTime').value = eventToEdit.time;
        document.getElementById('eventLocation').value = eventToEdit.location;
        document.getElementById('eventDescription').value = eventToEdit.description || '';
        
        // 设置编辑模式标志
        this.eventForm.dataset.editMode = 'true';
        this.eventForm.dataset.eventId = eventToEdit.id;
        
        // 更新模态框标题
        document.querySelector('#eventModal h3').textContent = '编辑事件';
    } else {
        // 添加模式
        document.getElementById('eventDate').value = this.formatDate(this.currentDate);
        
        // 移除编辑模式标志
        this.eventForm.removeAttribute('data-edit-mode');
        this.eventForm.removeAttribute('data-event-id');
        
        // 恢复模态框标题
        document.querySelector('#eventModal h3').textContent = '添加新事件';
    }
    
    this.eventModal.style.display = 'block';
}

  closeModal() {
    this.eventModal.style.display = "none";
    this.eventForm.reset();
  }

  handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        id: this.eventForm.dataset.editMode ? 
            parseInt(this.eventForm.dataset.eventId) : Date.now(),
        title: document.getElementById('eventTitle').value,
        date: document.getElementById('eventDate').value,
        time: document.getElementById('eventTime').value,
        location: document.getElementById('eventLocation').value,
        description: document.getElementById('eventDescription').value,
        status: 'pending' // 默认状态
    };
    
    if (this.eventForm.dataset.editMode) {
        // 编辑现有事件
        const index = this.events.findIndex(e => e.id === formData.id);
        if (index !== -1) {
            // 保留原有状态
            formData.status = this.events[index].status;
            this.events[index] = formData;
        }
    } else {
        // 添加新事件
        this.events.push(formData);
    }
    
    this.saveEvents();
    this.renderCalendar();
    this.closeModal();
}


  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  saveEvents() {
    localStorage.setItem("calendarEvents", JSON.stringify(this.events));
  }
}

// 确保DOM完全加载后初始化日历
document.addEventListener("DOMContentLoaded", () => {
  // 添加小的延迟确保所有元素都已加载
  setTimeout(() => {
    new Calendar();
  }, 50);
});
