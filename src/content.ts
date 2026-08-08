export type Language = "en" | "vi";
export const copy = {
  en: {
    nav: [
      "Home",
      "About",
      "Goals",
      "Projects",
      "Skills",
      "Education",
      "Contact",
    ],
    eyebrow: "Hey, I'm Thanh Nha.",
    title: "I build full‑stack web applications.",
    subtitle:
      "A Full-stack Developer based in Hanoi, focused on .NET, Python and building practical web products from interface to database.",
    about:
      "I enjoy turning real requirements into complete products: clear interfaces, reliable APIs and databases that remain understandable as a project grows. My strongest tools are Python and .NET, while I keep expanding my frontend craft through React and TypeScript.",
    short:
      "Complete my Full-stack Development foundation, focusing on .NET, Python, React and database design. I want to improve my ability to build APIs, develop interfaces and solve issues that arise during system operation.",
    long: "Become a Full-stack Developer capable of building complete products, from requirement analysis and system design to development, testing and deployment. I want to deepen my knowledge of architecture, performance, security and scalable systems.",
    education: "Information Technology",
    location: "Dai Nam University · Hanoi, Vietnam",
    contact: "LET'S BUILD SOMETHING TOGETHER.",
  },
  vi: {
    nav: [
      "Trang chủ",
      "Giới thiệu",
      "Mục tiêu",
      "Dự án",
      "Kỹ năng",
      "Học vấn",
      "Liên hệ",
    ],
    eyebrow: "Xin chào, mình là Thanh Nhã.",
    title: "Mình xây dựng các ứng dụng web full‑stack.",
    subtitle:
      "Full-stack Developer tại Hà Nội, tập trung vào .NET, Python và xây dựng sản phẩm thực tế từ giao diện đến cơ sở dữ liệu.",
    about:
      "Mình thích chuyển những yêu cầu thực tế thành sản phẩm hoàn chỉnh: giao diện rõ ràng, API đáng tin cậy và cơ sở dữ liệu dễ duy trì khi dự án phát triển. Python và .NET là hai công nghệ mình tự tin nhất, đồng thời mình tiếp tục hoàn thiện kỹ năng frontend với React và TypeScript.",
    short:
      "Hoàn thiện nền tảng Full-stack Development, tập trung vào .NET, Python, React và thiết kế cơ sở dữ liệu. Mình muốn nâng cao khả năng xây dựng API, phát triển giao diện và giải quyết vấn đề trong quá trình vận hành hệ thống.",
    long: "Trở thành Full-stack Developer có khả năng xây dựng sản phẩm hoàn chỉnh từ phân tích yêu cầu, thiết kế hệ thống đến phát triển, kiểm thử và triển khai; đồng thời đào sâu kiến trúc, hiệu năng, bảo mật và khả năng mở rộng.",
    education: "Công nghệ thông tin",
    location: "Đại học Đại Nam · Hà Nội, Việt Nam",
    contact: "CÙNG NHAU XÂY DỰNG MỘT ĐIỀU THÚ VỊ.",
  },
};
export const projects = [
  {
    name: "Pickleball Club Management",
    role: "Solo full-stack project",
    description:
      "Club operations platform covering court booking, tournaments, wallet flows and real-time updates.",
    stack: ["Flutter", "ASP.NET Core", "MySQL", "SignalR"],
    repo: "pickleball-club-management",
  },
  {
    name: "ASP.NET Ecommerce",
    role: "Full-stack project",
    description:
      "Ecommerce application with Identity, catalog, checkout, administration, email and live notifications.",
    stack: ["ASP.NET MVC", "SQL Server", "Identity", "MailKit"],
    repo: "aspnet-ecommerce",
  },
  {
    name: "LeafGuard AI",
    role: "AI web application",
    description:
      "Plant disease classification experience using trained vision models, safe uploads and explainable results.",
    stack: ["Python", "Flask", "EfficientNet", "YOLOv8"],
    repo: "leafguard-ai",
  },
  {
    name: "Electricity Forecasting",
    role: "Machine learning project",
    description:
      "Household electricity forecasting pipeline with validated inputs and a lightweight prediction interface.",
    stack: ["Python", "Random Forest", "Flask"],
    repo: "electricity-consumption-forecasting",
  },
];
export const skillGroups = {
  Frontend: ["React", "TypeScript", "JavaScript", "Flutter", "HTML", "CSS"],
  Backend: [".NET", "C#", "Python", "REST API", "SignalR"],
  Database: ["SQL Server", "MySQL", "SQLite", "Database Design"],
  Tools: ["Git", "GitHub Actions", "Visual Studio", "VS Code", "Swagger"],
};
