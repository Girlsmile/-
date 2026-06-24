const STORAGE_KEY = "strength-log-v1";
const THEME_KEY = "strength-log-theme";

const seedEntries = [
  {
    id: "seed-2026-05-25",
    date: "2026-05-25",
    type: "push",
    text: "卧推 65kg 5 5 5 6 6；上斜卧推 40kgx10x3；双杠臂屈伸 8x3；飞鸟 2.5kgx20x3"
  },
  {
    id: "seed-2026-05-26",
    date: "2026-05-26",
    type: "pull",
    text: "引体 7x4；宽距辅助引体 23kg 12 10 10 10；窄距划船 45kgx12 10，41kg 10 10；面拉 13kgx20x3；器械卷腹 14kgx15，18kgx12x2"
  },
  {
    id: "seed-2026-05-27",
    date: "2026-05-27",
    type: "legs",
    text: "杠铃深蹲 65x8x3，65x7，60x6；卷腹 18x15x4；下斜凳举腿 10x3；山羊挺身 10x2"
  },
  {
    id: "seed-2026-05-28",
    date: "2026-05-28",
    type: "push",
    text: "平板卧推 60kg 8 8 8 7 7；上斜卧推 35x10x4；双杠臂屈伸 5x2；哑铃飞鸟 2.5x20x4"
  },
  {
    id: "seed-2026-05-29",
    date: "2026-05-29",
    type: "pull",
    text: "引体 7x4；高位下拉 36kgx12x3；窄距划船 41kgx10x4；胸托宽距划船 10kgx9x3；空杠胸托后束 16x4；面拉 14kgx20x3"
  },
  {
    id: "seed-2026-06-01",
    date: "2026-06-01",
    type: "push",
    text: "卧推 65kg 5 6 6 6 6；双杠臂屈伸 9x3；上斜卧推 30kgx10x3；飞鸟 2.5kgx20x1，2.5kgx12x3"
  },
  {
    id: "seed-2026-06-02",
    date: "2026-06-02",
    type: "pull",
    text: "引体 7 8 8 7；高位下拉 36x12x3；窄距肩伸划船 32kgx10x4；胸托空杆宽距划船 16x4；蝴蝶机飞鸟 14x3"
  },
  {
    id: "seed-2026-06-03",
    date: "2026-06-03",
    type: "legs",
    text: "山羊挺身 20；下斜卷腹 20x2，16x2；器械卷腹 23kgx10x2，18kgx12x2；蹲腿机 70kgx10x4；器械举腿 30kgx10x2"
  },
  {
    id: "seed-2026-06-04",
    date: "2026-06-04",
    type: "push",
    text: "卧推 60kg 8 8 8 8 9；双杠臂屈伸 9x3；器械飞鸟 18kgx12x3；蝴蝶机夹上胸 32kgx12x3"
  },
  {
    id: "seed-2026-06-05",
    date: "2026-06-05",
    type: "pull",
    text: "引体 8 8 7 7；高位下拉 36kgx12x3；窄距划船 41kgx12x2，36kgx12x2；卷下腹 20x2；器械卷上腹 18kgx16x2；面拉 18kgx12x4"
  },
  {
    id: "seed-2026-06-06",
    date: "2026-06-06",
    type: "mixed",
    text: "器械卷腹 35kg 20x4；下斜板卷腹 20x4；哑铃飞鸟 5kgx15x2；绳索飞鸟 5kgx15x4"
  },
  {
    id: "seed-2026-06-08",
    date: "2026-06-08",
    type: "push",
    text: "卧推 65kg 6 6 6 7 6；双杠臂屈伸 10x3；上斜哑铃 17.5kg 8 8 7；哑铃飞鸟 2.5kgx20x4"
  },
  {
    id: "seed-2026-06-09",
    date: "2026-06-09",
    type: "pull",
    text: "引体 8 8 8 7；高位下拉 41kgx10；窄距划船 41kgx10x4；胸托宽距划船 5kgx12；直臂下压 24kgx10x2"
  },
  {
    id: "seed-2026-06-10",
    date: "2026-06-10",
    type: "legs",
    text: "卷腹机 23kgx16x3；举腿 16x4；蹬腿机 80x8x4；器械飞鸟 18kgx16x4"
  },
  {
    id: "seed-2026-06-11",
    date: "2026-06-11",
    type: "push",
    text: "卧推 60kg 8 9 8 8 7；上斜卧推 40kg 6 6 7；臂屈伸 10x2；哑铃飞鸟 5kgx15x3"
  },
  {
    id: "seed-2026-06-12",
    date: "2026-06-12",
    type: "pull",
    text: "高位下拉 41kgx12x4；窄距划船 45kgx10x4；胸托中距 10kgx10x2；胸托空杆宽距 20x3；卷腹 23kgx16x3"
  },
  {
    id: "seed-2026-06-15",
    date: "2026-06-15",
    type: "push",
    text: "卧推 65kg 6 7 7 7 6；双杠臂屈伸 12x3；上斜卧推 35kgx8x2；哑铃飞鸟 2.5kgx15x4"
  },
  {
    id: "seed-2026-06-16",
    date: "2026-06-16",
    type: "pull",
    text: "引体 8 8 7 7（前二高质量）；高位下拉 41kgx10x2，36kgx10；胸托宽距 空杆16，5kgx20x3；窄距划船 32kgx10x4"
  },
  {
    id: "seed-2026-06-17",
    date: "2026-06-17",
    type: "legs",
    text: "卷腹机 23kgx16x4；深蹲 60kg 8 8，70kg 8 6；举腿 16x4；飞鸟 20x3"
  },
  {
    id: "seed-2026-06-18",
    date: "2026-06-18",
    type: "push",
    text: "卧推 55kg 11x3，10；上斜卧推 35kg 10 9 9；双杠臂屈伸 8x2；器械飞鸟 18kgx16x2，14kgx15；绳索三头 9kgx16x2"
  },
  {
    id: "seed-undated-after-0618",
    date: "",
    type: "pull",
    text: "原文未写日期，暂不计入打卡：高位下拉 36kgx5x12；单边器械划船 30kgx12x4；中距划船 32kgx12x3；蝴蝶机飞鸟 18kgx16x3"
  },
  {
    id: "seed-2026-06-22",
    date: "2026-06-22",
    type: "push",
    text: "卧推 65kg 7 7 7 7 6；双杠臂屈伸 12 12 10；上斜哑铃卧推 15kgx8x3；器械飞鸟 18kgx14，14kgx10x3；绳索下拉 9kgx2x15"
  },
  {
    id: "seed-2026-06-23",
    date: "2026-06-23",
    type: "pull",
    text: "引体（间歇两分钟技术力竭）7 7 6；坐姿划船单边 32.5kgx12x4；对握高位下拉 36kg 12 10 10 10；面拉 18kgx16x4；二头弯举 15kgx10x2"
  }
];

const typeLabels = {
  push: "推日",
  pull: "拉日",
  legs: "腿核",
  mixed: "混合"
};

const typeNames = {
  push: "推",
  pull: "拉",
  legs: "腿核",
  mixed: "混合"
};

let entries = loadEntries();
let activeFilter = "all";
let currentMonth = "2026-06";

const el = {
  totalDays: document.querySelector("#totalDays"),
  monthDays: document.querySelector("#monthDays"),
  monthLabel: document.querySelector("#monthLabel"),
  bestStreak: document.querySelector("#bestStreak"),
  benchMax: document.querySelector("#benchMax"),
  monthPicker: document.querySelector("#monthPicker"),
  calendar: document.querySelector("#calendar"),
  records: document.querySelector("#records"),
  typeBars: document.querySelector("#typeBars"),
  benchSparkline: document.querySelector("#benchSparkline"),
  entryForm: document.querySelector("#entryForm"),
  entryDate: document.querySelector("#entryDate"),
  entryType: document.querySelector("#entryType"),
  entryText: document.querySelector("#entryText"),
  resetData: document.querySelector("#resetData"),
  themeToggle: document.querySelector("#themeToggle")
};

function loadEntries() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return seedEntries.slice();

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : seedEntries.slice();
  } catch {
    return seedEntries.slice();
  }
}

function saveEntries() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function parseDate(value) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(value) {
  if (!value) return "未标日期";
  const date = parseDate(value);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function dateKey(date) {
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function datedEntries() {
  return entries.filter((entry) => entry.date);
}

function uniqueDates() {
  return [...new Set(datedEntries().map((entry) => entry.date))].sort();
}

function getBenchWeight(entry) {
  const match = entry.text.match(/(?:平板)?卧推\s*(\d+(?:\.\d+)?)\s*kg?/i);
  return match ? Number(match[1]) : null;
}

function renderStats() {
  const dates = uniqueDates();
  const monthEntries = datedEntries().filter((entry) => entry.date.startsWith(currentMonth));
  const benchWeights = datedEntries().map(getBenchWeight).filter((value) => value !== null);
  const maxBench = benchWeights.length ? Math.max(...benchWeights) : null;

  el.totalDays.textContent = dates.length;
  el.monthDays.textContent = new Set(monthEntries.map((entry) => entry.date)).size;
  el.monthLabel.textContent = currentMonth.replace("-", "年") + "月";
  el.bestStreak.textContent = calculateBestStreak(dates);
  el.benchMax.textContent = maxBench ? `${maxBench}kg` : "-";
}

function calculateBestStreak(dates) {
  if (!dates.length) return 0;

  let best = 1;
  let current = 1;
  for (let index = 1; index < dates.length; index += 1) {
    const prev = parseDate(dates[index - 1]);
    const next = parseDate(dates[index]);
    const diffDays = Math.round((next - prev) / 86400000);

    if (diffDays === 1) {
      current += 1;
      best = Math.max(best, current);
    } else {
      current = 1;
    }
  }
  return best;
}

function renderCalendar() {
  el.monthPicker.value = currentMonth;
  el.calendar.innerHTML = "";

  const [year, month] = currentMonth.split("-").map(Number);
  const first = new Date(year, month - 1, 1);
  const last = new Date(year, month, 0);
  const mondayOffset = (first.getDay() + 6) % 7;
  const today = new Date();
  const entriesByDate = groupByDate();

  for (let index = 0; index < mondayOffset; index += 1) {
    el.calendar.appendChild(createDayCell(null, true));
  }

  for (let day = 1; day <= last.getDate(); day += 1) {
    const date = new Date(year, month - 1, day);
    const key = dateKey(date);
    const dayEntries = entriesByDate[key] || [];
    const cell = createDayCell(date, false);

    if (dayEntries.length) {
      cell.classList.add("has-entry");
      cell.querySelector(".day-title").textContent = dayEntries.map((entry) => typeNames[entry.type]).join(" / ");
      cell.title = dayEntries.map((entry) => `${typeLabels[entry.type]}：${entry.text}`).join("\n");
    }

    if (sameDay(date, today)) cell.classList.add("today");
    el.calendar.appendChild(cell);
  }
}

function createDayCell(date, isEmpty) {
  const cell = document.createElement("div");
  cell.className = "day";
  if (isEmpty) {
    cell.classList.add("empty-month");
    return cell;
  }

  const num = document.createElement("span");
  num.className = "date-num";
  num.textContent = date.getDate();

  const title = document.createElement("span");
  title.className = "day-title";
  title.textContent = " ";

  cell.append(num, title);
  return cell;
}

function groupByDate() {
  return datedEntries().reduce((groups, entry) => {
    groups[entry.date] ||= [];
    groups[entry.date].push(entry);
    return groups;
  }, {});
}

function renderTypeBars() {
  const counts = entries.reduce((acc, entry) => {
    acc[entry.type] = (acc[entry.type] || 0) + 1;
    return acc;
  }, {});
  const max = Math.max(1, ...Object.values(counts));

  el.typeBars.innerHTML = Object.keys(typeLabels)
    .map((type) => {
      const value = counts[type] || 0;
      const width = Math.round((value / max) * 100);
      return `
        <div class="bar-row">
          <span>${typeLabels[type]}</span>
          <div class="bar-track"><div class="bar-fill" style="width:${width}%"></div></div>
          <strong>${value}</strong>
        </div>
      `;
    })
    .join("");
}

function renderSparkline() {
  const points = datedEntries()
    .map((entry) => ({ date: entry.date, weight: getBenchWeight(entry) }))
    .filter((item) => item.weight !== null)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (points.length < 2) {
    el.benchSparkline.innerHTML = `<text x="24" y="92">卧推记录不足，继续写就会有走势。</text>`;
    return;
  }

  const width = 640;
  const height = 180;
  const pad = 28;
  const min = Math.min(...points.map((item) => item.weight)) - 2.5;
  const max = Math.max(...points.map((item) => item.weight)) + 2.5;
  const xStep = (width - pad * 2) / (points.length - 1);

  const coords = points.map((item, index) => {
    const x = pad + index * xStep;
    const ratio = (item.weight - min) / (max - min || 1);
    const y = height - pad - ratio * (height - pad * 2);
    return { ...item, x, y };
  });

  const line = coords.map((point) => `${point.x},${point.y}`).join(" ");
  const circles = coords
    .map((point) => `<circle class="point" cx="${point.x}" cy="${point.y}" r="5"><title>${point.date} ${point.weight}kg</title></circle>`)
    .join("");
  const labels = `
    <text x="${pad}" y="22">${max - 2.5}kg</text>
    <text x="${pad}" y="${height - 8}">${min + 2.5}kg</text>
  `;

  el.benchSparkline.innerHTML = `
    <polyline class="line" points="${line}"></polyline>
    ${circles}
    ${labels}
  `;
}

function renderRecords() {
  const template = document.querySelector("#recordTemplate");
  const filtered = entries
    .filter((entry) => activeFilter === "all" || entry.type === activeFilter)
    .sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return b.date.localeCompare(a.date);
    });

  el.records.innerHTML = "";

  filtered.forEach((entry) => {
    const node = template.content.firstElementChild.cloneNode(true);
    node.dataset.id = entry.id;
    node.querySelector("time").textContent = formatDate(entry.date);
    node.querySelector("strong").textContent = typeLabels[entry.type] || "训练";
    node.querySelector("p").textContent = entry.text;
    node.querySelector(".delete-entry").addEventListener("click", () => deleteEntry(entry.id));
    el.records.appendChild(node);
  });

  if (!filtered.length) {
    el.records.innerHTML = `<p class="empty-state">这个筛选下还没有记录。</p>`;
  }
}

function deleteEntry(id) {
  entries = entries.filter((entry) => entry.id !== id);
  saveEntries();
  render();
}

function render() {
  renderStats();
  renderCalendar();
  renderTypeBars();
  renderSparkline();
  renderRecords();
}

document.querySelector("#prevMonth").addEventListener("click", () => {
  const [year, month] = currentMonth.split("-").map(Number);
  currentMonth = dateKey(new Date(year, month - 2, 1)).slice(0, 7);
  render();
});

document.querySelector("#nextMonth").addEventListener("click", () => {
  const [year, month] = currentMonth.split("-").map(Number);
  currentMonth = dateKey(new Date(year, month, 1)).slice(0, 7);
  render();
});

el.monthPicker.addEventListener("change", (event) => {
  currentMonth = event.target.value;
  render();
});

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll(".filter").forEach((item) => item.classList.toggle("active", item === button));
    renderRecords();
  });
});

el.entryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const entry = {
    id: `custom-${Date.now()}`,
    date: el.entryDate.value,
    type: el.entryType.value,
    text: el.entryText.value.trim()
  };

  entries.push(entry);
  saveEntries();
  currentMonth = entry.date.slice(0, 7);
  el.entryForm.reset();
  el.entryDate.value = dateKey(new Date());
  render();
});

el.resetData.addEventListener("click", () => {
  entries = seedEntries.slice();
  saveEntries();
  currentMonth = "2026-06";
  render();
});

el.themeToggle.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
  localStorage.setItem(THEME_KEY, document.documentElement.classList.contains("dark") ? "dark" : "light");
});

function applyInitialTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (stored === "dark" || (!stored && prefersDark)) {
    document.documentElement.classList.add("dark");
  }
}

applyInitialTheme();
el.entryDate.value = dateKey(new Date());
render();
