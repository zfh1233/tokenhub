/* ============================================
   OpenCode School — SPA JavaScript
   ============================================ */

(function() {
  "use strict";

  var LESSONS = [
    {slug:"installation",num:"01",title:"安装",desc:"检查系统并安装 OpenCode 桌面版。"},
    {slug:"interview",num:"02",title:"面试",desc:"告诉 OpenCode 一些关于你的信息，让它为你量身定制课程。"},
    {slug:"configuration",num:"03",title:"配置",desc:"创建 OpenCode 的全局配置文件。"},
    {slug:"permissions",num:"04",title:"权限",desc:"控制 OpenCode 可以和不可以做什么。"},
    {slug:"instructions",num:"05",title:"指令",desc:"编写 OpenCode 在每次会话中遵循的自定义指令。"},
    {slug:"models",num:"06",title:"模型",desc:"在 OpenCode 中选择和配置 AI 模型。"},
    {slug:"commands",num:"07",title:"命令",desc:"为你重复执行的任务创建自定义斜杠命令。"},
    {slug:"skills",num:"08",title:"技能",desc:"使用技能安装可重用的代理行为。"},
    {slug:"tools",num:"09",title:"工具",desc:"使用外部工具和 MCP 服务器扩展 OpenCode。"},
    {slug:"plugins",num:"10",title:"插件",desc:"使用插件扩展 OpenCode，添加工具、钩入事件并集成外部服务。"},
    {slug:"agents",num:"11",title:"代理",desc:"使用规划代理和构建代理，先思考再行动。"},
    {slug:"sessions",num:"12",title:"会话",desc:"管理和恢复对话。"},
    {slug:"images",num:"13",title:"图片",desc:"与 OpenCode 分享图片和截图。"},
    {slug:"workspaces",num:"14",title:"工作区",desc:"在同一项目上运行多个并行任务，避免文件冲突。"}
  ];

  var EXERCISES = [
    {slug:"build-a-website",title:"构建网站",desc:"使用 Hono 构建个人主页并部署到 Cloudflare Workers。"},
    {slug:"run-ai-models",title:"运行 AI 模型",desc:"使用 Replicate 上的 AI 模型生成图片和视频。"},
    {slug:"transcribe-speech",title:"语音转文字",desc:"使用 Whisper 在本地将音频转写为文字。"},
    {slug:"drive-a-browser",title:"操控浏览器",desc:"使用 Chrome DevTools MCP 自动化你的真实浏览器。"},
    {slug:"post-to-social-media",title:"发布社交媒体",desc:"使用 Typefully 头脑风暴并起草社交媒体帖子。"},
    {slug:"use-git-and-github",title:"使用 Git 和 GitHub",desc:"使用 Git 和 GitHub 跟踪更改，做出你的第一个开源贡献。"},
    {slug:"achieve-inbox-zero",title:"收件箱归零",desc:"分类处理电子邮件，批量处理消息，使用 Gmail 发送邮件。"},
    {slug:"use-an-ai-gateway",title:"使用 AI 网关",desc:"通过 Cloudflare 的 AI 网关和统一计费路由 AI 请求。"}
  ];

  var STATIC_PAGES = [
    {slug:"about",title:"关于"},
    {slug:"tips",title:"技巧与窍门"},
    {slug:"cheatsheet",title:"速查表"},
    {slug:"changelog",title:"更新日志"},
    {slug:"glossary",title:"术语表"},
    {slug:"contributing",title:"贡献"}
  ];

  function lessonBySlug(s){for(var i=0;i<LESSONS.length;i++)if(LESSONS[i].slug===s)return LESSONS[i];return null;}
  function exerciseBySlug(s){for(var i=0;i<EXERCISES.length;i++)if(EXERCISES[i].slug===s)return EXERCISES[i];return null;}

  // ---- School API ----
  window.school = {
    getStudentId:function(){return localStorage.getItem("studentId");},
    setStudentId:function(id){localStorage.setItem("studentId",id);},
    getDeviceId:function(){var d=localStorage.getItem("deviceId");if(!d){d=crypto.randomUUID?crypto.randomUUID():"dev-"+Math.random().toString(36).substr(2,9);localStorage.setItem("deviceId",d);}return d;},
    getThemeColor:function(){return localStorage.getItem("themeColor")||"blue";},
    setThemeColor:function(t){var p=window.__schoolThemePalettes;var n=p[t]?t:"blue";localStorage.setItem("themeColor",n);window.__applySchoolTheme(n);updateSwatchSelection(n);return n;},
    getCachedProgress:function(){try{return JSON.parse(localStorage.getItem("progress")||"null");}catch(e){return null;}},
    setCachedProgress:function(p){localStorage.setItem("progress",JSON.stringify(p));},
    isLessonComplete:function(s){var p=this.getCachedProgress();return p&&p.completedLessons?p.completedLessons.some(function(l){return(typeof l==="string"?l:l.slug)===s;}):false;},
    isExerciseComplete:function(s){var p=this.getCachedProgress();return p&&p.completedExercises?p.completedExercises.some(function(e){return(typeof e==="string"?e:e.slug)===s;}):false;},
    getVisitedLessons:function(){try{return JSON.parse(localStorage.getItem("visitedLessons")||"[]");}catch(e){return[];}},
    isLessonVisited:function(s){return this.getVisitedLessons().indexOf(s)!==-1;},
    markLessonVisited:function(s){var v=this.getVisitedLessons();if(v.indexOf(s)===-1){v.push(s);localStorage.setItem("visitedLessons",JSON.stringify(v));}},
    enroll:function(){var self=this;return new Promise(function(resolve){setTimeout(function(){var id="STU-"+Math.random().toString(36).substr(2,8).toUpperCase();self.setStudentId(id);self.setCachedProgress({completedLessons:[],completedExercises:[]});resolve({studentId:id,progress:{completedLessons:[],completedExercises:[]}});},800);});},
    markComplete:function(s){var p=this.getCachedProgress()||{completedLessons:[],completedExercises:[]};if(!p.completedLessons.some(function(l){return(typeof l==="string"?l:l.slug)===s;}))p.completedLessons.push(s);this.setCachedProgress(p);this.updateAllCheckmarks();return p;},
    markExerciseComplete:function(s){var p=this.getCachedProgress()||{completedLessons:[],completedExercises:[]};if(!p.completedExercises.some(function(e){return(typeof e==="string"?e:e.slug)===s;}))p.completedExercises.push(s);this.setCachedProgress(p);this.updateAllCheckmarks();return p;},
    updateAllCheckmarks:function(){
      var nextIncompleteSet=false;
      document.querySelectorAll("[data-lesson-slug]").forEach(function(el){
        var slug=el.getAttribute("data-lesson-slug");var isStub=el.getAttribute("data-lesson-stub")==="true";
        var rowEl=el.querySelector(".lesson-row");var ctaEl=el.querySelector(".lesson-cta");
        var statusEl=el.querySelector(".lesson-status");var checkEl=el.querySelector(".lesson-check");var dotEl=el.querySelector(".lesson-status-dot");
        var complete=school.isLessonComplete(slug);var isNext=!complete&&!isStub&&!nextIncompleteSet;if(isNext)nextIncompleteSet=true;
        if(rowEl)rowEl.classList.toggle("lesson-row--next",isNext);
        if(ctaEl){ctaEl.classList.toggle("hidden",!isNext);if(isNext)ctaEl.textContent=school.isLessonVisited(slug)?"继续":"开始";}
        if(statusEl)statusEl.classList.toggle("lesson-status--complete",complete);
        if(checkEl)checkEl.classList.toggle("hidden",!complete);
        if(dotEl)dotEl.classList.toggle("hidden",complete);
      });
      document.querySelectorAll("[data-sidebar-slug]").forEach(function(el){
        var slug=el.getAttribute("data-sidebar-slug");var c=el.querySelector(".sidebar-check");
        if(c){var complete=school.isLessonComplete(slug);c.textContent=complete?"\u2713":"";c.classList.toggle("visible",complete);}
      });
      document.querySelectorAll("[data-sidebar-exercise-slug]").forEach(function(el){
        var slug=el.getAttribute("data-sidebar-exercise-slug");var c=el.querySelector(".sidebar-check");
        if(c){var complete=school.isExerciseComplete(slug);c.textContent=complete?"\u2713":"";c.classList.toggle("visible",complete);}
      });
      document.querySelectorAll("[data-exercise-slug]").forEach(function(el){
        var slug=el.getAttribute("data-exercise-slug");var complete=school.isExerciseComplete(slug);
        var statusEl=el.querySelector(".lesson-status");var checkEl=el.querySelector(".lesson-check");var dotEl=el.querySelector(".lesson-status-dot");
        if(statusEl)statusEl.classList.toggle("lesson-status--complete",complete);
        if(checkEl)checkEl.classList.toggle("hidden",!complete);
        if(dotEl)dotEl.classList.toggle("hidden",complete);
      });
    }
  };

  // ---- DOM refs ----
  var menuToggle,sidebar,sidebarOverlay,menuIconOpen,menuIconClose,searchTrigger,searchModal,searchModalBackdrop,searchInput,darkToggle;
  function cacheDom(){
    menuToggle=document.getElementById("menu-toggle");sidebar=document.getElementById("sidebar");sidebarOverlay=document.getElementById("sidebar-overlay");
    menuIconOpen=document.getElementById("menu-icon-open");menuIconClose=document.getElementById("menu-icon-close");
    searchTrigger=document.getElementById("search-trigger");searchModal=document.getElementById("search-modal");
    searchModalBackdrop=document.getElementById("search-modal-backdrop");searchInput=document.getElementById("search-input");
    darkToggle=document.getElementById("dark-toggle");
  }

  // ---- Mobile Menu ----
  var mobileMenuOpen=false;
  function toggleMobileMenu(){
    mobileMenuOpen=!mobileMenuOpen;sidebar.classList.toggle("mobile-open",mobileMenuOpen);sidebarOverlay.classList.toggle("active",mobileMenuOpen);
    menuIconOpen.style.display=mobileMenuOpen?"none":"block";menuIconClose.style.display=mobileMenuOpen?"block":"none";
    document.body.style.overflow=mobileMenuOpen?"hidden":"";
  }

  // ---- Search ----
  function openSearch(){searchModal.classList.remove("hidden");setTimeout(function(){searchInput.focus();},50);document.body.style.overflow="hidden";renderSearchResults("");}
  function closeSearch(){searchModal.classList.add("hidden");searchInput.value="";document.body.style.overflow="";}

  var searchData=[];
  function buildSearchData(){
    searchData=[];
    LESSONS.forEach(function(l){searchData.push({title:l.title,desc:l.desc,type:"课程",slug:l.slug,route:"/lessons/"+l.slug});});
    EXERCISES.forEach(function(e){searchData.push({title:e.title,desc:e.desc,type:"练习",slug:e.slug,route:"/exercises/"+e.slug});});
    STATIC_PAGES.forEach(function(p){searchData.push({title:p.title,desc:"",type:"页面",slug:p.slug,route:"/"+p.slug});});
  }
  buildSearchData();

  function renderSearchResults(query){
    var container=document.getElementById("search-results");
    if(!query.trim()){container.innerHTML='<div class="search-results-empty">开始输入以搜索...</div>';return;}
    var q=query.toLowerCase();var results=searchData.filter(function(item){return item.title.toLowerCase().indexOf(q)!==-1||(item.desc&&item.desc.toLowerCase().indexOf(q)!==-1);});
    if(results.length===0){container.innerHTML='<div class="search-results-empty">未找到结果。</div>';return;}
    container.innerHTML=results.map(function(item){return '<a href="#'+item.route+'" class="search-result-item"><span class="result-title">'+escHtml(item.title)+'</span><span style="color:var(--text-tertiary);font-size:0.75rem;">'+escHtml(item.type)+'</span></a>';}).join("");
  }

  function updateSwatchSelection(c){document.querySelectorAll(".color-swatch").forEach(function(s){s.classList.toggle("selected",s.getAttribute("data-color")===c);});}

  function fireCelebration(){
    var layer=document.getElementById("celebration-layer");if(!layer)return;
    var colors=["#ef4444","#f97316","#eab308","#22c55e","#3b82f6","#8b5cf6","#ec4899","#06b6d4","#f43f5e","#14b8a6"];
    for(var i=0;i<40;i++){
      var p=document.createElement("div");p.className="celebration-particle";
      var sz=4+Math.random()*8,vx=(Math.random()-0.5)*200,vy=-(50+Math.random()*150),rot=Math.random()*720-360,dur=0.6+Math.random()*0.8;
      p.style.cssText="width:"+sz+"px;height:"+sz+"px;background:"+colors[Math.floor(Math.random()*colors.length)]+";left:50%;top:50%;--vx:"+vx+"px;--vy:"+vy+"px;--rot:"+rot+"deg;--dur:"+dur+"s;border-radius:"+(Math.random()>0.5?"50%":"2px")+";";
      layer.appendChild(p);(function(el){setTimeout(function(){el.remove();},1500);})(p);
    }
  }

  // ---- Helpers ----
  function escHtml(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
  function escAttr(s){return s.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");}

  function getPromptText(slug,type){
    var sid=school.getStudentId()||"NOT-ENROLLED";
    var item=type==="课程"?lessonBySlug(slug):exerciseBySlug(slug);if(!item)return"";
    return"我正在学习 OpenCode，请教我"+item.title+(type==="课程"?"课程":"练习")+"。课程内容在 https://opencode.school/"+(type==="课程"?"lessons":"exercises")+"/"+slug;
  }
  function promptCard(slug,type){
    var text=getPromptText(slug,type);
    return'<div class="prompt-card"><div class="prompt-label">OpenCode 提示词</div><div class="prompt-text">'+escHtml(text)+'</div><button class="prompt-copy-btn theme-button" data-copy="'+escAttr(text)+'">复制</button></div>';
  }
  function enrollmentBanner(){if(school.getStudentId())return"";return'<div class="enrollment-banner"><a href="#/" class="theme-link">免费注册</a> 以跟踪你的课程进度。</div>';}
  function completedBanner(slug,type){var c=type==="课程"?school.isLessonComplete(slug):school.isExerciseComplete(slug);if(!c)return"";return'<div class="completed-banner">\u2713 你已完成此'+(type==="课程"?"课程":"练习")+'!</div>';}
  function navLinks(curSlug,type){
    var list=type==="课程"?LESSONS:EXERCISES;var idx=-1;
    for(var i=0;i<list.length;i++)if(list[i].slug===curSlug){idx=i;break;}
    var h='<div class="lesson-nav">';
    if(idx>0)h+='<a href="#/'+(type==="课程"?"lessons":"exercises")+'/'+list[idx-1].slug+'" class="lesson-nav-prev">\u2190 '+list[idx-1].title+'</a>';
    if(idx<list.length-1)h+='<a href="#/'+(type==="课程"?"lessons":"exercises")+'/'+list[idx+1].slug+'" class="lesson-nav-next">'+list[idx+1].title+' \u2192</a>';
    return h+'</div>';
  }
  function markCompleteBtn(slug,type){
    var c=type==="课程"?school.isLessonComplete(slug):school.isExerciseComplete(slug);
    if(c)return'<div class="mark-complete-done">\u2713 已完成</div>';
    return'<button class="mark-complete-btn theme-button" data-mark-complete="'+slug+'" data-mark-type="'+type+'">将此'+(type==="课程"?"课程":"练习")+' 标记为完成</button>';
  }

  // ---- Lesson Content Functions ----
  var LC={};

  LC.installation=function(){
    return'<p>在本课程中，我们将使用 <strong>OpenCode 桌面版</strong> \u2014 一个原生应用程序，带有 <a href="#/glossary" class="theme-link">GUI</a>（图形用户界面），你可以使用鼠标和键盘与之交互。如果你使用过 ChatGPT 或 Claude 等应用，这个聊天界面应该会让你感到很熟悉。</p><p>OpenCode 还有 <a href="https://opencode.ai/docs/tui/" class="theme-link">TUI</a>（终端用户界面）用于基于终端的工作流，<a href="https://opencode.ai/docs/cli/" class="theme-link">CLI</a>（命令行界面）用于一次性命令，以及 <a href="https://opencode.ai/docs/ide/" class="theme-link">IDE 扩展</a> 用于 VS Code、Cursor、Zed 和 Windsurf。 你在这里学到的技能适用于任何这些界面。但对于本课程，<strong>你只需要桌面版</strong>。</p><p>在安装任何东西之前，让我们先做一个快速的系统检查。</p><div class="system-check-card"><h3>系统检查</h3><div class="system-check-items"><div class="system-check-item"><span class="system-check-label">操作系统</span><span class="system-check-value" id="sys-os">检测中\u2026</span></div><div class="system-check-item"><span class="system-check-label">CPU 核心数</span><span class="system-check-value" id="sys-cpu">检测中\u2026</span></div><div class="system-check-item"><span class="system-check-label">内存</span><span class="system-check-value" id="sys-mem">检测中\u2026</span></div><div class="system-check-item"><span class="system-check-label">网络</span><span class="system-check-value" id="sys-net">检测中\u2026</span></div></div><p class="system-check-ready">你的系统已就绪！</p></div><h2 id="install-opencode-desktop">安装 OpenCode 桌面版</h2><p>根据你的平台下载 OpenCode 桌面版：</p><div class="download-platforms"><div class="download-platform"><h4>macOS</h4><a href="https://opencode.ai/download/stable/darwin-aarch64-dmg" class="theme-link">Apple Silicon</a> &middot; <a href="https://opencode.ai/download/stable/darwin-x64-dmg" class="theme-link">Intel</a><p>或使用 <a href="#/glossary" class="theme-link">Homebrew</a> 安装：</p><pre><code>brew install --cask opencode-desktop</code></pre></div><div class="download-platform"><h4>Windows</h4><a href="https://opencode.ai/download/stable/windows-x64-nsis" class="theme-link">下载 Windows 版</a><p>运行安装程序并按照屏幕提示操作。<strong>推荐：</strong>安装 <a href="https://opencode.ai/docs/windows-wsl" class="theme-link">WSL</a>。</p></div><div class="download-platform"><h4>Linux</h4><a href="https://opencode.ai/download/stable/linux-x64-deb" class="theme-link">.deb</a> &middot; <a href="https://opencode.ai/download/stable/linux-x64-rpm" class="theme-link">.rpm</a><p>.deb 用于 Ubuntu/Debian，.rpm 用于 Fedora/RHEL。</p></div></div><h2 id="launch-the-app">启动应用</h2><p>从应用程序菜单或停靠栏双击 OpenCode 桌面版。</p><h2 id="open-a-project">打开项目</h2><p>你将被提示打开一个项目 \u2014 点击 <strong>打开项目</strong> 并选择你电脑上的任何文件夹。</p><h2 id="enter-a-prompt">输入提示词</h2><p>试试这个提示词来确认一切正常：</p><blockquote>你好，你在吗？</blockquote><p>按 <strong>回车键</strong> 发送。如果你收到回复，说明你已连接并准备就绪。</p>'+markCompleteBtn("installation","课程");
  };

  LC.interview=function(){
    return'<p>在本课中，OpenCode 将向你提几个可选问题，关于你的背景和偏好。你的回答有助于定制其余课程 \u2014 调整详细程度、选择相关示例、并匹配你对终端和代码的熟悉程度。</p><p>所有问题都是可选的。跳过你不想回答的问题。</p><p>由于这是课程早期，OpenCode 还没有广泛的权限。你可能需要在本课中点击几次\u201c允许\u201d\u2014\u2014这是正常的。你将在后续课程中设置权限。</p>'+promptCard("interview","课程")+'<p>在 OpenCode 中完成本课以继续。</p>'+markCompleteBtn("interview","课程");
  };

  LC.configuration=function(){
    return'<p>每个课程都有一个提示词，你可以复制粘贴到 OpenCode 中。提示词包含你的学号和本站链接，这让 OpenCode 拥有教授课程和跟踪你进度所需的一切。</p><p>在本课中，你将创建 一个<strong>全局配置文件</strong>，将适用于你机器上每个项目的每次 OpenCode 会话。它包括使用哪个 AI <a href="#/glossary" class="theme-link">模型</a>、授予什么<a href="#/glossary" class="theme-link">权限</a>以及<a href="#/glossary" class="theme-link">代理</a>应如何行为的设置。</p><p><strong>如果你已经创建了全局配置文件，那很好 \u2014 它不会被覆盖。</strong></p>'+promptCard("configuration","课程")+'<h2 id="create-the-global-config-file">创建全局配置文件</h2><p>OpenCode 启动时，它会在以下位置查找全局配置文件：</p><pre><code>~/.config/opencode/opencode.json</code></pre><ul><li><strong>macOS / Linux</strong>: <code>~/.config/opencode/opencode.json</code></li><li><strong>Windows (WSL)</strong>: <code>~/.config/opencode/opencode.json</code> （在你的 WSL 主目录内）</li><li><strong>Windows (native)</strong>: <code>C:\\Users\\&lt;YourName&gt;\\.config\\opencode\\opencode.json</code></li></ul><h2 id="set-some-basic-configuration">设置一些基本配置</h2><p>你的配置文件将如下所示：</p><pre><code>{\n  "$schema": "https://opencode.ai/config.json",\n  "default_agent": "plan",\n  "permission": {\n    "*": "allow",\n    "edit": "allow",\n    "webfetch": "allow",\n    "external_directory": "ask",\n    "bash": {\n      "*": "allow",\n      "rm *": "ask",\n      "rmdir *": "ask"\n    }\n  },\n  "instructions": [\n    "https://&lt;this-site&gt;/api/instructions/&lt;your-student-id&gt;"\n  ]\n}</code></pre><p>几个要注意的地方：</p><ul><li><code>"default_agent": "plan"</code> 意味着每个新会话以<a href="#/lessons/agents" class="theme-link">规划模式</a>启动 \u2014 一个不会进行更改的只读代理。</li><li><code>"edit": "allow"</code> 和 <code>"webfetch": "allow"</code> 覆盖将这些设置为 <code>"ask"</code> 的默认值。</li><li><code>"external_directory": "ask"</code> 意味着 OpenCode 在触碰项目外的文件之前会暂停。</li><li><code>"bash"</code> 块添加了安全防护 \u2014 <code>rm</code> 和 <code>rmdir</code> 将首先请求批准。</li></ul><h2 id="restart-opencode">重启 OpenCode</h2><p>配置更改在下次启动时生效。 <strong>退出并重新打开 OpenCode 桌面版</strong>，然后返回此会话。</p><h2 id="verify-config-is-working">验证配置是否生效</h2>'+promptCard("configuration","课程")+'<p>完整参考： <a href="https://opencode.ai/docs/config/" class="theme-link">OpenCode 配置文档</a>.</p>'+markCompleteBtn("configuration","课程");
  };

  LC.permissions=function(){
    return promptCard("permissions","课程")+'<p>在配置课程中，你用 <code>"ask"</code> 规则设置了基本权限。现在让我们更进一步 \u2014 为 Git 操作添加防护并学习按项目覆盖。</p><h2 id="the-three-permission-levels">三个权限级别</h2><table class="prose-table"><thead><tr><th>级别</th><th>会发生什么</th></tr></thead><tbody><tr><td><code>allow</code></td><td>操作立即运行，无需确认</td></tr><tr><td><code>ask</code></td><td>OpenCode 暂停并请求你的批准</td></tr><tr><td><code>deny</code></td><td>操作被完全阻止</td></tr></tbody></table><h2 id="when-opencode-asks-for-permission">当 OpenCode 请求权限时</h2><p>当 OpenCode 遇到 <code>ask</code> 规则时，它会显示三个选项：</p><ul><li><strong>仅允许一次</strong> \u2014 仅批准此次特定操作</li><li><strong>始终允许</strong> \u2014 批准此操作及本次会话中类似操作</li><li><strong>拒绝</strong> \u2014 拒绝此特定操作</li></ul><p><a href="https://x.com/mattrothenberg/status/2031383560062370235"><img src="https://opencode.school/images/allow-always-keyboard.jpg" alt="权限疲劳键盘" class="prose-img"></a></p><h2 id="add-git-guardrails">添加 Git 保护</h2><p>更新你全局配置中的 <code>bash</code> 块：</p><pre><code>"bash": {\n  "*": "allow",\n  "rm *": "ask",\n  "rmdir *": "ask",\n  "git push *": "ask",\n  "git checkout *": "ask"\n}</code></pre><h2 id="per-project-permissions">按项目权限</h2><p>在任何项目目录中创建 <code>.opencode/opencode.json</code> 来覆盖该项目的全局权限。</p><h2 id="working-outside-the-project">在项目外工作</h2><p>OpenCode 的作用范围限于你启动它的目录。<code>external_directory</code> 权限控制对项目外文件的访问。</p><p>完整参考，请见 <a href="https://opencode.ai/docs/permissions/" class="theme-link">权限文档</a>。</p>'+markCompleteBtn("permissions","课程");
  };

  LC.instructions=function(){
    return promptCard("instructions","课程")+'<p>每次 OpenCode 启动新<a href="#/glossary" class="theme-link">会话</a>时，它会查找名为 <code>AGENTS.md</code> 的文件并读取你写在那里的指令。可以把它当作 AI 助手的常备指令。</p><h2 id="global-vs-project">全局 vs. 项目</h2><p>有两种 AGENTS.md 文件：</p><ul><li><strong>全局</strong> (<code>~/.config/opencode/AGENTS.md</code>) \u2014 适用于每个会话。你的个人偏好文件。不提交到 Git。</li><li><strong>项目级</strong> (项目根目录中的 <code>AGENTS.md</code>) \u2014 仅适用于该项目。通常提交到 Git，让整个团队受益。</li></ul><h2 id="create-your-agentsmd">创建你的 AGENTS.md</h2><p>OpenCode 将创建文件并填充初始内容。批准任何权限提示。</p><h2 id="what-to-put-in-it">里面写什么</h2><p>以下是全局 AGENTS.md 可能的样子：</p><pre><code>## About me\n- My name is Ren. I\'m a frontend developer based in Melbourne.\n- My GitHub username is `rendev` and my email is `ren@example.com`.\n- I primarily work in TypeScript and Python.\n\n## Communication\n- Be concise. Don\'t oversell changes or use fancy words.\n- Never use em dashes. Use commas, colons, or separate sentences instead.\n\n## Writing\n- When writing pull request descriptions, start with "This PR..."\n- When writing markdown, avoid headings smaller than H2.\n\n## Working with Git\n- Always use semantic commit prefixes (feat:, fix:, docs:, etc.).\n- Never push to the main branch. Always push to a feature branch.\n- Run the project\'s lint script before committing, if one exists.</code></pre><p>你的指令可以涵盖任何内容：你喜欢的沟通方式、首选工具、个人背景、写作风格、安全规则或编码规范。</p><h2 id="edit-it-anytime">随时编辑</h2><p>你的 AGENTS.md 是一个纯文本文件。随时让 OpenCode 更新它。更改在下次会话时生效。</p><h2 id="initializing-a-project-agentsmd">初始化项目 AGENTS.md</h2><p>使用 <code>/init</code> 命令可以生成一个项目专属的 AGENTS.md，其中描述了你项目的结构、规范和技术栈。</p><pre><code>/init</code></pre><p>更多详情，请见 <a href="https://opencode.ai/docs/rules/" class="theme-link">规则文档</a>。</p>'+markCompleteBtn("instructions","课程");
  };

  LC.models=function(){
    return promptCard("models","课程")+'<p>你选择的模型可能是决定 OpenCode 会话成功与否的最重要因素。Anthropic 和 OpenAI 的最新模型能力很强 \u2014 它们编写更好的代码、推理复杂问题并犯更少的错误。但每次请求都要花钱。</p><h2 id="see-which-model-youre-using">查看你正在使用的模型</h2><p>你当前的模型显示在桌面应用的文本输入框下方。当你初次安装 OpenCode 时，你可以通过 <a href="https://opencode.ai/zen/" class="theme-link">OpenCode Zen</a> 获取免费模型。</p><h2 id="change-the-model">更改模型</h2><p>点击文本输入框下方的模型名称打开模型选择器，或输入 <code>/model</code>。</p><h2 id="built-in-models">内置模型</h2><p>OpenCode Zen 包括几个免费模型：</p><ul><li><strong>Big Pickle</strong> \u2014 一个为编码代理优化的隐身模型。目前免费。</li><li><strong>GPT-5 Nano</strong> \u2014 OpenAI 最小最快的模型。</li><li><strong>Nemotron 3 Super Free</strong> \u2014 NVIDIA 的开放权重模型，拥有 1M token 上下文窗口。</li><li><strong>MiMo V2 Flash Free</strong> \u2014 小米的开源模型。擅长编码和推理。</li><li><strong>MiniMax M2.5 Free</strong> \u2014 擅长编码和代理工具使用。</li></ul><p>这些模型不收费，但有权衡：大多缺乏视觉支持，在复杂任务上通常能力较弱。</p><h2 id="opencode-go">OpenCode Go</h2><p><a href="https://opencode.ai/go" class="theme-link">OpenCode Go</a> 是一个订阅计划（$10/月），包括：GLM-5、Kimi K2.5、MiniMax M2.5、MiniMax M2.7。<strong>Kimi K2.5 支持视觉。</strong></p><h2 id="cloudflare">Cloudflare</h2><p>如果你有 Cloudflare 账户，你可以使用 <strong>AI 网关</strong> <a href="https://developers.cloudflare.com/ai-gateway/features/unified-billing/" class="theme-link">统一计费</a> 来访问多个提供商的模型，无需单独的 API 密钥。</p><h2 id="context-and-context-windows">上下文和上下文窗口</h2><p>每个模型都有一个<a href="#/glossary" class="theme-link">上下文窗口</a> \u2014 它一次能\u201c看到\u201d的最大文本量。大型旗舰模型通常有 128K+ token。较小模型通常有 8K\u201332K token。</p><h2 id="other-providers">其他提供商</h2><p>OpenCode 支持 <a href="https://opencode.ai/docs/providers/" class="theme-link">75+ 模型提供商</a>。Anthropic 和 OpenAI 的最新旗舰模型通常是最强大的。</p>'+markCompleteBtn("models","课程");
  };

  LC.commands=function(){
    return promptCard("commands","课程")+'<p>如果你发现自己反复输入同样的提示词，自定义命令可以保存该提示词并用一个斜杠命令运行。</p><p>在输入框中输入 <code>/</code> 查看可用命令。</p><h2 id="two-ways-to-define-a-command">定义命令的两种方式</h2><h3>Markdown 文件</h3><p>在 <code>~/.config/opencode/commands/</code>（全局）或 <code>.opencode/commands/</code>（按项目）中创建 <code>.md</code> 文件。文件名即为命令名。</p><pre><code>---\ndescription: Summarize the current project\n---\nGive me a brief overview of this project. What is it? What are the main files and folders?</code></pre><p>现在你可以在任何会话中运行 <code>/summarize</code>。</p><h3>在 opencode.json 中使用 JSON</h3><pre><code>{\n  "command": {\n    "summarize": {\n      "description": "Summarize the current project",\n      "template": "Give me a brief overview of this project..."\n    }\n  }\n}</code></pre><h2 id="try-it-create-a-summarize-command">试试：创建 /summarize 命令</h2><p>让 OpenCode 创建文件，然后 <strong>重启 OpenCode</strong>。命令在启动时加载。</p><h2 id="passing-arguments">传递参数</h2><p>在模板中添加 <code>$ARGUMENTS</code> 占位符：</p><pre><code>---\ndescription: Explain a file\n---\nExplain what $ARGUMENTS does in plain language.</code></pre><p>然后运行 <code>/explain src/index.ts</code>，<code>$ARGUMENTS</code> 将被替换。</p><p>完整参考，请见 <a href="https://opencode.ai/docs/commands/" class="theme-link">命令文档</a>。</p>'+markCompleteBtn("commands","课程");
  };

  LC.skills=function(){
    return promptCard("skills","课程")+'<p>技能是可重用的指令集，让你的 AI 代理在特定任务上更聪明。该格式由 Anthropic 创建，已被 40+ AI 工具支持。</p><h2 id="how-skills-work">技能如何运作</h2><p>技能是一个包含 <code>SKILL.md</code> 文件的文件夹。该文件至少有 <code>name</code>、<code>description</code> 和指令。技能还可以捆绑脚本、参考文档和模板。</p><h2 id="install-with-npx-skills">使用 npx skills 安装</h2><p>安装技能的最佳方式是使用 <a href="https://www.npmjs.com/package/skills" class="theme-link">skills CLI</a>。它会一次安装到你所有的 AI 工具。</p><h2 id="install-four-skills">安装四个技能</h2><p>运行这四个命令安装一套有用的全局技能：</p><p><strong>Cloudflare</strong> \u2014 用于构建 Workers、AI、KV、R2、D1 的技能：</p><pre><code>npx skills add https://github.com/cloudflare/skills</code></pre><p><strong>Replicate</strong> \u2014 用于发现和运行 AI 模型的技能：</p><pre><code>npx skills add replicate/skills</code></pre><p><strong>frontend-design</strong> \u2014 来自 Anthropic 的 UI/UX 设计模式：</p><pre><code>npx skills add https://github.com/anthropics/skills --skill frontend-design</code></pre><p><strong>skill-creator</strong> \u2014 从任何工作流创建你自己的技能：</p><pre><code>npx skills add https://github.com/anthropics/skills --skill skill-creator</code></pre><h2 id="restart-opencode">重启 OpenCode</h2><p>技能在 OpenCode 启动时加载。<strong>退出并重新打开 OpenCode 桌面版</strong>。</p><h2 id="create-your-own-skills">创建你自己的技能</h2><p><code>skill-creator</code> 让你将任何工作流变成可重用的技能。全局技能位于 <code>~/.config/opencode/skills/</code>。项目技能位于 <code>.opencode/skills/</code>。</p><p>在 <a href="https://skills.sh" class="theme-link">skills.sh</a> 找到更多技能。</p>'+markCompleteBtn("skills","课程");
  };

  LC.tools=function(){
    return promptCard("tools","课程")+'<p>当你向 AI 发送消息时，它生成文本。仅此而已。但有时你需要 AI 真正去<em>做</em>些什么：查天气、搜索网页、读取文件或调用 API。这就是工具的用途。</p><p>OpenCode 内置了读取文件、编辑代码和运行命令等工具。但你也可以使用名为 <strong>MCP</strong>（模型上下文协议）的标准扩展外部工具。</p><h2 id="two-kinds-of-mcp-servers">两种 MCP 服务器</h2><p><strong>本地服务器</strong>在你自己的机器上作为进程运行。<strong>远程服务器</strong>在云端运行 \u2014 你通过 URL 连接，不需要本地进程。</p><h2 id="add-a-weather-mcp-server">添加天气 MCP 服务器</h2><p>让我们安装一个本地 MCP 服务器，从 <a href="https://open-meteo.com" class="theme-link">Open-Meteo</a> 获取实时天气数据 \u2014 一个免费的公共天气 API。</p><p>将这添加到你的 <code>~/.config/opencode/opencode.json</code>：</p><pre><code>"mcp": {\n  "open-meteo": {\n    "type": "local",\n    "command": ["npx", "-y", "-p", "open-meteo-mcp-server", "open-meteo-mcp-server"]\n  }\n}</code></pre><h2 id="check-with-mcp">使用 /mcp 检查</h2><p>输入 <code>/mcp</code> 查看你配置的 MCP 服务器及其连接状态。</p><h2 id="restart-opencode">重启 OpenCode</h2><p>MCP 服务器在启动时连接。<strong>退出并重新打开 OpenCode 桌面版</strong>。</p><h2 id="try-it">试试看</h2><p>问 OpenCode 类似这样的问题：</p><blockquote>本周东京的天气预报是什么？</blockquote><p>观察 OpenCode 响应时的界面 \u2014 你应该会看到它对天气服务器进行工具调用。</p><p>在 <a href="https://registry.modelcontextprotocol.io" class="theme-link">官方 MCP 注册表</a> 找到更多 MCP 服务器。</p>'+markCompleteBtn("tools","课程");
  };

  LC.plugins=function(){
    return promptCard("plugins","课程")+'<p>在工具课程中，你添加了一个 MCP 服务器。MCP 很适合连接服务 \u2014 但如果你想挂钩 OpenCode 的生命周期、修改工具行为或注册用 TypeScript 编写的全新工具呢？这就是插件的用途。</p><h2 id="where-plugins-live">插件的位置</h2><p><strong>项目级插件</strong> 位于 <code>.opencode/plugins/</code>。<strong>全局插件</strong> 位于 <code>~/.config/opencode/plugins/</code>。</p><h2 id="what-plugins-can-do">插件能做什么</h2><p>插件是一个 JavaScript 或 TypeScript 模块，可以订阅事件、添加自定义工具并改变 OpenCode 的工作方式：</p><pre><code>export const MyPlugin = async ({ project, client, $ }) =&gt; {\n  return {\n    "session.idle": async ({ event }) =&gt; {\n      // Do something when a session finishes\n    },\n  }\n}</code></pre><h2 id="install-the-replicate-plugin">安装 Replicate 插件</h2><p>获取 <a href="https://replicate.com/account/api-tokens" class="theme-link">Replicate API token</a> 并将其添加到你的 shell 配置文件：</p><pre><code>export REPLICATE_API_TOKEN=r8_your_token_here</code></pre><p>运行安装脚本：</p><pre><code>curl -sSL https://raw.githubusercontent.com/lucataco/replicate-opencode-plugin/main/install.sh | bash</code></pre><h2 id="restart-opencode">重启 OpenCode</h2><p>插件在启动时加载。<strong>退出并重新打开 OpenCode 桌面版</strong>。</p><p>在 <a href="https://opencode.ai/docs/ecosystem/" class="theme-link">OpenCode 生态系统页面</a> 找到更多插件。</p>'+markCompleteBtn("plugins","课程");
  };

  LC.agents=function(){
    return promptCard("agents","课程")+'<p>在 OpenCode 中，代理是为特定任务或工作流配置的专业助手 \u2014 拥有自己的指令、工具和权限。</p><p>OpenCode 内置了两个代理：<strong>规划</strong> 和 <strong>构建</strong>。</p><h2 id="the-plan-agent">规划代理</h2><p>规划是一个只读的对话代理。它可以读取你的文件并讨论你的项目，但不会做任何更改。不写入文件、不运行命令、不修改任何东西。</p><p>规划模式是给模型的指令，不是硬性沙箱。偶尔代理可能仍会发出 API 调用或运行有副作用的命令。</p><h2 id="the-build-agent">构建代理</h2><p>构建是实现代理。它拥有完全访问权限 \u2014 可以读取文件、写入文件、运行 shell 命令并进行更改。</p><h2 id="how-to-switch">如何切换</h2><p><strong>在 OpenCode 桌面版中：</strong>使用提示输入框下方的下拉菜单。<strong>在 TUI 中：</strong>按 <code>Tab</code>。</p><h2 id="the-recommended-workflow">推荐的工作流</h2><ol><li><strong>从规划开始。</strong>描述你想要完成的事情。</li><li><strong>一起探索。</strong>提问题、考虑选项、完善方法。</li><li><strong>切换到构建。</strong>让它实现你规划的内容。</li></ol><h2 id="custom-agents">自定义代理</h2><p>你可以在 <code>opencode.json</code> 中定义自己的代理，带有自定义指令、特定工具、首选模型等。请见 <a href="https://opencode.ai/docs/agents/" class="theme-link">代理文档</a>。</p>'+markCompleteBtn("agents","课程");
  };

  LC.sessions=function(){
    return promptCard("sessions","课程")+'<p>你与 OpenCode 的每次对话都是一个会话。会话有自己的历史和上下文 \u2014 模型记住会话中说的所有内容，但在新会话中重新开始。</p><h2 id="starting-a-new-session">开始新会话</h2><p>在提示框中输入 <code>/new</code>，或点击侧边栏中的 <strong>新建会话</strong>。</p><h2 id="sessions-persist">会话持久化</h2><p>你的会话历史保存在磁盘上。即使退出并重启 OpenCode，你也可以恢复任何之前的会话。</p><h2 id="sharing-a-session">分享会话</h2><p>运行 <code>/share</code> 生成公开链接（<code>opncd.ai/s/&lt;id&gt;</code>）。运行 <code>/unshare</code> 停止分享。</p><p>分享模式：<code>manual</code>（默认）、<code>auto</code> 或 <code>disabled</code>。</p><h2 id="listing-and-exporting-sessions">列出和导出会话</h2><pre><code>opencode session list</code></pre><pre><code>opencode export &lt;sessionID&gt;</code></pre>'+markCompleteBtn("sessions","课程");
  };

  LC.images=function(){
    return promptCard("images","课程")+'<p>给 OpenCode 提供有用上下文的最有效方式之一是粘贴图片。这仅在你使用的模型具有<strong>视觉</strong>能力时有效。</p><h2 id="how-to-add-an-image">如何添加图片</h2><ul><li><strong>拖放</strong> \u2014 将图片文件拖入 OpenCode 窗口</li><li><strong>粘贴</strong> \u2014 复制图片然后按 <code>Cmd+V</code>（Mac）或 <code>Ctrl+V</code></li></ul><h2 id="which-models-support-vision">哪些模型支持视觉</h2><table class="prose-table"><thead><tr><th>模型系列</th><th>视觉支持</th></tr></thead><tbody><tr><td>Claude (Haiku, Sonnet, Opus)</td><td>是</td></tr><tr><td>GPT-4、GPT-4.1、GPT-5 系列</td><td>是</td></tr><tr><td>Gemini 3 Flash, Gemini 3.1 Pro</td><td>是</td></tr><tr><td>Kimi K2.5</td><td>是</td></tr><tr><td>Big Pickle, MiMo, Nemotron, MiniMax Free</td><td>未确认</td></tr></tbody></table><h2 id="what-vision-is-useful-for">视觉的用途</h2><ul><li><strong>复刻设计</strong> \u2014 粘贴截图并让 OpenCode 重新创建</li><li><strong>调试视觉 bug</strong> \u2014 粘贴看起来有问题的截图</li><li><strong>实现模型</strong> \u2014 粘贴线框图并让 OpenCode 构建</li><li><strong>从图片提取文本</strong> \u2014 粘贴带文本的截图</li></ul><h2 id="try-it">试试看</h2><p>确保你使用的是支持视觉的模型，然后尝试粘贴图片并问模型看到了什么。</p>'+markCompleteBtn("images","课程");
  };

  LC.workspaces=function(){
    return promptCard("workspaces","课程")+'<p>工作区是一个高级功能，用于在同一项目上同时处理多个任务。<strong>如果你不在 Git 仓库上进行软件开发，可以跳过本课。</strong></p><h2 id="the-problem-workspaces-solve">工作区解决的问题</h2><p>当你在同一项目上同时运行两个 OpenCode 会话时，它们都在操作相同的文件。如果会话 A 在重构而会话 B 在添加功能，它们可能会意外覆盖彼此的更改。</p><h2 id="what-workspaces-are">工作区是什么</h2><p>工作区是你项目文件在自己 Git 分支上的完整隔离副本。每个工作区有自己的文件和会话。一个工作区中的更改不会影响任何其他工作区。</p><h2 id="how-to-create-a-workspace">如何创建工作区</h2><p>工作区是桌面版独有功能。你的项目必须是 Git 仓库。</p><ol><li>在 OpenCode 桌面版的左侧边栏中右键点击项目</li><li>选择 <strong>启用工作区</strong></li><li>点击 <strong>新建工作区</strong></li></ol><h2 id="what-happens-under-the-hood">底层发生了什么</h2><p>OpenCode 使用 <a href="https://git-scm.com/docs/git-worktree" class="theme-link">Git worktrees</a> 创建新分支并将其检出到单独的目录。</p><h2 id="when-to-use-workspaces">何时使用工作区</h2><ul><li>在同一项目上同时运行两个或更多长时间运行的会话</li><li>在不触碰主工作目录的情况下尝试有风险的更改</li><li>并行处理独立任务并在就绪时合并结果</li></ul>'+markCompleteBtn("workspaces","课程");
  };

  // ---- Exercise Content Functions ----
  var EC={};

  EC["build-a-website"]=function(){
    return'<p>是时候构建真实项目了。在本练习中，你将使用 <a href="https://workers.cloudflare.com" class="theme-link">Cloudflare Workers</a> 创建个人主页并部署到互联网。</p>'+promptCard("build-a-website","练习")+'<h2 id="the-tools">工具</h2><ul><li><strong><a href="https://hono.dev" class="theme-link">Hono</a></strong> \u2014 一个小巧快速的 Cloudflare Workers Web 框架</li><li><strong><a href="https://tailwindcss.com" class="theme-link">Tailwind CSS</a></strong> \u2014 从 CDN 加载的工具优先 CSS，无需构建步骤</li><li><strong><a href="https://developers.cloudflare.com/workers/" class="theme-link">Cloudflare Workers</a></strong> \u2014 在边缘运行代码的无服务器平台</li></ul><h2 id="prerequisites">前置条件</h2><p>你需要安装 <a href="https://nodejs.org" class="theme-link">Node.js</a> 并拥有一个免费的 <a href="https://dash.cloudflare.com/sign-up" class="theme-link">Cloudflare 账户</a>。</p><h2 id="what-youll-build">你将构建什么</h2><p>一个个人主页 \u2014 包含你的名字、简短简介、兴趣爱好以及个人资料或项目链接的页面。你将用 Tailwind 让它看起来精致并实时部署。</p>'+markCompleteBtn("build-a-website","练习");
  };

  EC["run-ai-models"]=function(){
    return'<p>在本练习中，你将直接在 OpenCode 中使用 AI 模型生成图片和视频。你将使用 <a href="https://replicate.com" class="theme-link">Replicate</a> \u2014 一个托管数千个开源 AI 模型的平台。</p>'+promptCard("run-ai-models","练习")+'<h2 id="prerequisites">前置条件</h2><p>本练习需要 OpenCode 的 <strong>Replicate 技能</strong>。如果你完成了 <a href="#/lessons/skills" class="theme-link">技能课程</a>，你已经有了。如果没有，现在安装：</p><pre><code>npx skills add replicate/skills</code></pre><p>你还需要一个 <strong>Replicate 账户</strong>和来自 <a href="https://replicate.com/account/api-tokens" class="theme-link">replicate.com/account/api-tokens</a> 的 API 令牌。</p><h2 id="what-youll-do">你将做什么</h2><p>使用 Nano Banana 2（Google 的图片生成模型）<strong>生成图片</strong>。使用 Veo 3.1 Fast（Google 的视频生成模型）<strong>生成视频</strong>。</p>'+markCompleteBtn("run-ai-models","练习");
  };

  
  EC["transcribe-speech"]=function(){
    return'<p>每家大型科技公司都在云端运行语音转文本模型，但你可以在自己的机器上本地做同样的事。在本练习中，你将使用 <a href="https://github.com/openai/whisper" class="theme-link">Whisper</a> \u2014 OpenAI 的开源语音识别模型。</p>'+promptCard("transcribe-speech","练习")+'<h2 id="install-the-tools">安装工具</h2><pre><code>brew install whisper-cpp ffmpeg</code></pre><h2 id="download-a-model">下载模型</h2><pre><code>curl -o ggml-large-v3-q5_0.bin -L https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-large-v3-q5_0.bin</code></pre><h2 id="get-some-audio">获取音频</h2><p>录制自己的声音、重用编辑视频练习中的音频，或下载一个播客片段。</p><h2 id="what-youll-do">你将做什么</h2><ul><li>将你的音频转换为 16kHz WAV 格式</li><li>运行转写并获取带时间戳的文本输出</li><li>将转写内容导出为 SRT 或 VTT 字幕</li></ul><p>Whisper 还可以将其他语言的语音<strong>翻译</strong>成英语。</p>'+markCompleteBtn("transcribe-speech","练习");
  };

  EC["drive-a-browser"]=function(){
    return'<p>从 Chrome 144 开始，你的 AI 代理可以驱动你真实的浏览器 \u2014 你每天使用的那个，所有标签页打开、所有账户已登录。</p>'+promptCard("drive-a-browser","练习")+'<h2 id="set-up-chrome-devtools-mcp">设置 Chrome DevTools MCP</h2><p>启用远程调试：在 Chrome 中导航到 <code>chrome://inspect/#remote-debugging</code> 并启用它。</p><p>将 MCP 服务器添加到你的 OpenCode 配置：</p><pre><code>"mcp": {\n  "chrome-devtools": {\n    "type": "local",\n    "command": ["npx", "-y", "chrome-devtools-mcp@latest", "--autoConnect"]\n  }\n}</code></pre><p>做此更改后重启 OpenCode。</p><h2 id="start-in-plan-mode">从规划模式开始</h2><p>在让代理与你的浏览器交互之前，切换到 <strong>规划模式</strong>。这是一个好的安全实践。</p><h2 id="the-killer-feature">杀手锧功能：你现有的会话</h2><p>你的代理继承你现有的 Chrome 会话。你已经登录了所有网站。这开启了那些从未被设计为自动化的网站。</p><h2 id="what-youll-do">你将做什么</h2><p>从简单开始 \u2014 截取当前标签页的屏幕截图。然后尝试 Lighthouse 审计。之后，练习是开放式的。</p>'+markCompleteBtn("drive-a-browser","练习");
  };

  EC["post-to-social-media"]=function(){
    return'<p>在本练习中，你将使用 OpenCode 头脑风暴并起草社交媒体帖子，然后发送到 <a href="https://typefully.com" class="theme-link">Typefully</a> 进行审核和发布。</p>'+promptCard("post-to-social-media","练习")+'<h2 id="prerequisites">前置条件</h2><p>安装 <strong>Typefully 技能</strong>：</p><pre><code>npx skills add typefully/agent-skills</code></pre><p>获取 <a href="https://typefully.com/?settings=api" class="theme-link">Typefully API 密钥</a> 并将其添加到你的 shell 配置文件：</p><pre><code>export TYPEFULLY_API_KEY=your_key_here</code></pre><h2 id="what-youll-do">你将做什么</h2><ul><li><strong>头脑风暴</strong> \u2014 告诉你的代理你想发什么</li><li><strong>起草</strong> \u2014 代理将你的帖子创建为 Typefully 草稿</li><li><strong>串帖</strong>（可选）\u2014 创建一系列相连的帖子</li></ul><h2 id="writing-tips">写作技巧</h2><ul><li>以钩子开头 \u2014 第一行决定是否有人继续读下去</li><li>像你说话那样写</li><li>保持聚焦。每个帖子一个想法。</li></ul>'+markCompleteBtn("post-to-social-media","练习");
  };

  EC["use-git-and-github"]=function(){
    return'<p><a href="https://git-scm.com" class="theme-link">Git</a> 让你能看到每一次变更的发生。 <a href="https://github.com" class="theme-link">GitHub</a> 给你一个安全存储工作和与他人协作的地方。</p>'+promptCard("use-git-and-github","练习")+'<h2 id="get-started-with-github-desktop">开始使用 GitHub Desktop</h2><p><a href="https://desktop.github.com/" class="theme-link">GitHub Desktop</a> 是从零开始建立 Git 工作环境的最简单方式。它安装 Git、登录 GitHub 并认证 CLI。</p><h2 id="install-the-gh-cli">安装 gh CLI</h2><p><a href="https://cli.github.com/" class="theme-link">gh CLI</a> 是 GitHub 的代理接口。安装 <code>gh</code> 后，OpenCode 可以读取 issue、创建拉取请求等。</p><h2 id="what-youll-do">你将做什么</h2><ul><li>在项目文件夹中初始化仓库</li><li>创建提交</li><li>审查差异</li><li>推送到 GitHub</li><li>创建分支</li></ul><h2 id="contribute-to-opencode-school">贡献 OpenCode 学校</h2><p>一旦你熟悉了，你可以 fork <a href="https://github.com/opencodeschool/opencode.school" class="theme-link">OpenCode 学校仓库</a>，做一个小改进，并创建拉取请求。</p>'+markCompleteBtn("use-git-and-github","练习");
  };

  EC["achieve-inbox-zero"]=function(){
    return'<p>电子邮件是最耗时的日常任务之一。在本练习中，你将把 OpenCode 连接到你的 Gmail 账户，并用它批量处理收件箱。</p>'+promptCard("achieve-inbox-zero","练习")+'<h2 id="prerequisites">前置条件</h2><p>你需要一个 <a href="https://gmail.com" class="theme-link">Gmail</a> 账户和两个 CLI 工具：</p><pre><code>brew install google-cloud-sdk\nbrew install googleworkspace-cli</code></pre><p>运行 <code>gws auth setup --login</code> 以你的 Gmail 账户进行认证。</p><h2 id="what-youll-do">你将做什么</h2><ul><li>一次性<strong>分类处理</strong>未读收件箱</li><li><strong>批量处理</strong>消息</li><li>使用 Gmail 查询语法<strong>搜索</strong>你的邮箱</li><li>使用草稿优先的安全模式<strong>撰写和发送</strong>电子邮件</li><li><strong>创建一个技能</strong>教 OpenCode 如何管理你的 Gmail</li></ul><h2 id="drafts-first">草稿优先</h2><p>每封发出的邮件都经过草稿步骤。代理撰写消息并等待你的明确同意后才发送。</p>'+markCompleteBtn("achieve-inbox-zero","练习");
  };

  EC["use-an-ai-gateway"]=function(){
    return'<p>当你在 OpenCode 中使用 AI 模型时，你的请求直接发往模型提供商。AI 网关位于 OpenCode 和提供商之间，给你一个单一控制点：一个账单、一套日志、一个管理访问的地方。</p>'+promptCard("use-an-ai-gateway","练习")+'<h2 id="why-use-a-gateway">为什么使用网关？</h2><ul><li><strong>统一账单</strong> \u2014 一次充值，使用任何受支持提供商的模型</li><li><strong>日志</strong> \u2014 每个请求和响应都记录在一处</li><li><strong>提供商切换</strong> \u2014 无需创建新账户即可尝试不同模型</li><li><strong>缓存</strong> \u2014 重复的相同请求可以从缓存提供</li></ul><h2 id="prerequisites">前置条件</h2><p>你需要一个免费的 <a href="https://dash.cloudflare.com/sign-up" class="theme-link">Cloudflare 账户</a>和安装好的 <a href="https://nodejs.org" class="theme-link">Node.js</a>。你还需要充值至少 $5。</p><h2 id="what-youll-do">你将做什么</h2><ul><li>在 Cloudflare 控制台中<strong>创建网关</strong></li><li>为统一计费<strong>加载余额</strong></li><li>在 OpenCode 中<strong>存储网关 token</strong></li><li>从至少两个不同的提供商<strong>添加模型</strong></li><li>通过网关聊天来<strong>测试</strong></li></ul>'+markCompleteBtn("use-an-ai-gateway","练习");
  };

  // ---- Static Page Content ----
  var SP={};

  SP.about=function(){
    return'<div class="about-cards"><a href="https://opencode.ai" target="_blank" rel="noopener noreferrer" class="about-card"><h3>OpenCode 是什么？</h3><p>一个免费开源的 AI 编程代理，支持 75+ 模型提供商，安装在你的电脑上本地运行。</p></a><a href="https://opencode.ai/docs/" target="_blank" rel="noopener noreferrer" class="about-card"><h3>官方文档</h3><p>完整的使用指南和 API 参考，涵盖安装、配置、命令和高级功能。</p></a><a href="https://opencode.ai/discord" target="_blank" rel="noopener noreferrer" class="about-card"><h3>社区</h3><p>加入 Discord 服务器，与其他用户交流经验、获取帮助和分享作品。</p></a><a href="https://github.com/opencodeschool/opencode.school" target="_blank" rel="noopener noreferrer" class="about-card"><h3>开源项目</h3><p>本教程是开源项目，欢迎贡献内容和报告问题。源代码以 Apache 2.0 许可证发布。</p></a></div><p style="margin-top:1.5rem;font-size:0.875rem;color:var(--text-secondary);">本教程内容来源于 <a href="https://opencode.school/" class="theme-link" target="_blank" rel="noopener noreferrer">opencode.school</a>，由 OpenCode 社区维护。</p>';
  };

  SP.tips=function(){
    return'<h2 id="flexible-systems">记住 OpenCode 和 OpenCode 学校是灵活的系统</h2><p>你可以选择自己的冒险方式。超越界限。可以幽默。可以强势。</p><ul><li>想直奔主题？直接说：<em>\u201c跳过冗长描述，直接做这些更改。\u201d</em></li><li>想回顾进度？很简单：<em>\u201c让我们回顾一下学校里目前学过的内容。\u201d</em></li><li>想用另一种语言上课？没问题：<em>\u201c我们用西班牙语来做所有内容！\u201d</em></li></ul><h2 id="describe-the-goal">描述目标</h2><p>谈论 <em>什么</em>，而不是 <em>如何</em>。代理可能想出比你最初想法更简单或更有效的方法。</p><h2 id="know-when-to-give-up">知道何时放弃并重新开始</h2><p>有时你会陷入死胡同：代理犯了错，你试图纠正，结果更糟。重要的技能是知道何时重置。不要害怕停止会话、反思你学到的东西、用更清晰的指令开始新的会话。</p><h2 id="open-a-higher-level-directory">打开更高层级的目录以获得更广泛的访问</h2><p>OpenCode 的作用范围限于你启动它的目录。如果你一直在 <code>~/projects/foo</code> 中工作，OpenCode 只能看到该文件夹中的文件。如果你想同时对多个项目进行更改，打开更高层级的目录，如 <code>~/projects</code>。你甚至可以打开整个主目录（<code>~</code>）给 OpenCode 最广泛的访问权限。</p>';
  };

  SP.cheatsheet=function(){
    return'<h2 id="slash-commands">斜杠命令</h2><table class="prose-table"><thead><tr><th>命令</th><th>作用</th></tr></thead><tbody><tr><td><code>/new</code></td><td>开始新会话</td></tr><tr><td><code>/sessions</code></td><td>列出并切换会话</td></tr><tr><td><code>/help</code></td><td>显示帮助对话框</td></tr><tr><td><code>/init</code></td><td>项目 AGENTS.md 的引导设置</td></tr><tr><td><code>/connect</code></td><td>添加模型提供商 (TUI)</td></tr><tr><td><code>/models</code></td><td>打开模型选择器</td></tr><tr><td><code>/mcp</code></td><td>列出 MCP 服务器和连接状态</td></tr><tr><td><code>/share</code></td><td>将当前会话分享为公开链接</td></tr><tr><td><code>/unshare</code></td><td>停止分享当前会话</td></tr><tr><td><code>/undo</code></td><td>撤销上一条消息和文件更改</td></tr><tr><td><code>/redo</code></td><td>在 /undo 后恢复消息</td></tr><tr><td><code>/compact</code></td><td>总结会话以释放上下文</td></tr><tr><td><code>/details</code></td><td>切换工具执行详情</td></tr><tr><td><code>/thinking</code></td><td>切换模型推理可见性</td></tr></tbody></table><h2 id="prompt-syntax">提示语法</h2><table class="prose-table"><thead><tr><th>语法</th><th>作用</th></tr></thead><tbody><tr><td><code>@&lt;path&gt;</code></td><td>引用文件或目录</td></tr><tr><td><code>!&lt;command&gt;</code></td><td>从提示框运行 shell 命令</td></tr></tbody></table><h2 id="keyboard-shortcuts">键盘快捷键</h2><table class="prose-table"><thead><tr><th>快捷键</th><th>作用</th></tr></thead><tbody><tr><td>Return / Enter</td><td>发送当前消息</td></tr><tr><td>Shift+Return</td><td>插入换行且不发送</td></tr><tr><td>Cmd+V / Ctrl+V</td><td>粘贴图片或文本</td></tr><tr><td>Esc</td><td>中断响应或关闭弹出窗</td></tr></tbody></table><h2 id="cli-commands">CLI 命令</h2><table class="prose-table"><thead><tr><th>命令</th><th>作用</th></tr></thead><tbody><tr><td><code>opencode run "&lt;prompt&gt;"</code></td><td>非交互式运行单个提示词</td></tr><tr><td><code>opencode session list</code></td><td>列出所有项目的每个会话</td></tr><tr><td><code>opencode export &lt;sessionID&gt;</code></td><td>将会话导出为 JSON</td></tr><tr><td><code>opencode mcp auth &lt;name&gt;</code></td><td>认证 MCP 服务器</td></tr></tbody></table><h2 id="file-paths">文件路径</h2><h3>全局</h3><table class="prose-table"><thead><tr><th>路径</th><th>用途</th></tr></thead><tbody><tr><td><code>~/.config/opencode/opencode.json</code></td><td>主配置</td></tr><tr><td><code>~/.config/opencode/AGENTS.md</code></td><td>自定义指令</td></tr><tr><td><code>~/.config/opencode/commands/</code></td><td>自定义斜杠命令</td></tr><tr><td><code>~/.config/opencode/skills/</code></td><td>可重用技能</td></tr><tr><td><code>~/.config/opencode/plugins/</code></td><td>JS/TS 插件</td></tr></tbody></table><h3>按项目</h3><table class="prose-table"><thead><tr><th>路径</th><th>用途</th></tr></thead><tbody><tr><td><code>&lt;project&gt;/AGENTS.md</code></td><td>项目特定指令</td></tr><tr><td><code>&lt;project&gt;/.opencode/opencode.json</code></td><td>项目特定配置</td></tr><tr><td><code>&lt;project&gt;/.opencode/commands/</code></td><td>项目特定命令</td></tr><tr><td><code>&lt;project&gt;/.opencode/skills/</code></td><td>项目特定技能</td></tr><tr><td><code>&lt;project&gt;/.opencode/plugins/</code></td><td>项目特定插件</td></tr></tbody></table>';
  };

  SP.changelog=function(){
    var entries=[
      {date:"May 4",title:"站内搜索",desc:"使用 \u2318K 从任何页面搜索课程、练习和更新日志。由 Cloudflare AI Search 驱动。"},
      {date:"Apr 24",title:"配置中的权限覆盖",desc:"配置课程现在展示如何设置显式权限覆盖。"},
      {date:"Apr 22",title:"主题化代码块",desc:"课程正文中的代码块现在有主题边框和柔和光辉。"},
      {date:"Apr 21",title:"新页面：贡献",desc:"一个贡献页面，解释学生如何分享想法和报告问题。"},
      {date:"Apr 20",title:"MCP 重新认证指导",desc:"工具课程现在涵盖如何处理过期的 MCP 服务器认证。"},
      {date:"Apr 15",title:"新练习：使用 AI 网关",desc:"一个新练习将引导你设置 Cloudflare AI Gateway 与 OpenCode 配合使用。"},
      {date:"Apr 15",title:"新练习：收件箱归零",desc:"一个新练习教你使用 OpenCode 和 gws CLI 工具管理 Gmail。"},
      {date:"Apr 15",title:"每个页面的 GitHub 链接",desc:"每个页面右上角的固定 GitHub 图标链接到源代码。"},
      {date:"Apr 15",title:"权限疲劳键盘",desc:"权限课程现在展示一张说明权限疲劳的趣味键盘图片。"},
      {date:"Apr 15",title:"改进的 AGENTS.md 示例",desc:"指令课程现在使用更真实的 AGENTS.md 示例。"},
      {date:"Apr 14",title:"JSON 作为默认配置格式",desc:"课程现在推荐 opencode.json 作为默认配置文件名。"},
      {date:"Apr 12",title:"MCP 服务器发现链接",desc:"工具课程现在直接链接到 MCP 服务器目录和注册表。"},
      {date:"Apr 12",title:"外部目录配置和技巧",desc:"配置课程包含 external_directory；技巧页有关于更广泛访问的新技巧。"},
      {date:"Apr 9",title:"重置你的进度",desc:"学生现在可以撤销单个课程完成或重置所有进度。"},
      {date:"Apr 8",title:"两个新练习",desc:"使用 Git 和 GitHub 和发布社交媒体加入练习行列。"},
      {date:"Apr 8",title:"模型课程中的 Cloudflare AI 网关",desc:"模型课程现在涵盖 Cloudflare AI Gateway 和 Workers AI。"},
      {date:"Apr 8",title:"可分享的标题链接",desc:"站点中的正文标题现在都有锚点链接。"},
      {date:"Apr 7",title:"新课程：插件",desc:"一个关于用社区和自定义插件扩展 OpenCode 的新课程。"},
      {date:"Apr 7",title:"OpenGraph 图片",desc:"每个课程和练习页面现在都有独特的 OpenGraph 图片。"},
      {date:"Apr 7",title:"技能课程中的技能创建器",desc:"技能课程现在引导你从零开始构建自己的技能。"},
      {date:"Apr 7",title:"OpenCode 不仅仅是编码",desc:"课程内容和站点文案现在反映 OpenCode 是一个通用 AI 代理。"},
      {date:"Apr 7",title:"OpenCode 学校现已开源",desc:"源代码在 GitHub 上以 Apache 2.0 许可证提供。"},
      {date:"Apr 6",title:"规划模式作为默认",desc:"配置课程现在推荐以规划模式和防御性 bash 权限开始。"},
      {date:"Apr 5",title:"新页面：技巧与窍门",desc:"充分利用 OpenCode 的实用指南。"},
      {date:"Apr 5",title:"工具和权限的新内容",desc:"工具涵盖 /mcp 和配置编辑。权限涵盖 external_directory。"},
      {date:"Apr 3",title:"引入练习",desc:"五个超越课程内容的动手练习。"},
      {date:"Apr 1",title:"新页面：关于",desc:"一个包含项目信息、标识和社区链接的关于页面。"},
      {date:"Apr 1",title:"桌面界面的视频演示",desc:"安装课程现在包含视频演示。"},
      {date:"Apr 1",title:"解释上下文窗口",desc:"模型课程现在涵盖上下文窗口及其对模型行为的影响。"},
      {date:"Mar 31",title:"课程间的自动导航",desc:"当代理将当前课程标记为完成时，浏览器现在会自动导航到下一课。"},
      {date:"Mar 31",title:"新功能：新学生面试",desc:"一个面试课程，询问你的背景和偏好以个性化课程。"},
      {date:"Mar 31",title:"所有测验问题一次性显示",desc:"测验现在在单个屏幕上展示所有问题。"}
    ];
    var h="";
    entries.forEach(function(e){
      h+='<div class="changelog-entry"><div class="changelog-date">'+e.date+'</div><div class="changelog-title">'+e.title+'</div><div class="changelog-desc">'+e.desc+'</div></div>';
    });
    return h;
  };

  SP.glossary=function(){
    var terms=[
      {term:"agent",def:"AI 助手，可以读取文件、编写代码、运行命令并代你执行任务。OpenCode 的内置代理包括 build（用于进行更改）和 plan（用于思考问题而不做更改）。"},
      {term:"AGENTS.md",def:"包含自定义指令的纯文本文件，OpenCode 在每次会话开始时读取。可以全局存在（~/.config/opencode/AGENTS.md）或按项目存在。"},
      {term:"CLI",def:"命令行界面。通过输入文本命令与软件交互的方式。OpenCode 有一个 CLI 用于运行一次性任务。"},
      {term:"command",def:"在 OpenCode 内运行的斜杠前缀操作，如 /models 切换 AI 模型或 /undo 撤销上一次更改。"},
      {term:"config",def:"配置的简称。定义 OpenCode 行为偏好的文件（通常是 opencode.json）。"},
      {term:"context window",def:"模型在对话中一次能看到的文本量。以 token 为单位衡量（大约是字的 3/4）。更大的上下文窗口让模型能处理更大的代码库和更长的对话。"},
      {term:"GUI",def:"图形用户界面。带有窗口、按钮和菜单的可视化界面。OpenCode 桌面版就是一个 GUI。"},
      {term:"Homebrew",def:"macOS（和 Linux）的包管理器，可以从命令行安装软件。运行 brew install &lt;package&gt; 来安装。"},
      {term:"LLM",def:"大语言模型。一种接受现有文本并预测下一步的 AI。例如 Claude（Anthropic）、GPT（OpenAI）和 Gemini（Google）。"},
      {term:"Markdown",def:"开发者喜爱的纯文本格式。文件以 .md 结尾，使用简单字符格式化：# 用于标题、** 用于加粗、- 用于列表。"},
      {term:"MCP",def:"模型上下文协议。让 OpenCode 连接到外部工具和服务的开放标准。MCP 服务器可以是本地的或远程的。"},
      {term:"model",def:"驱动 OpenCode 的 AI 大脑。模型由 Anthropic (Claude)、OpenAI (GPT)、Google (Gemini) 等公司创建。不同模型有不同的优势、速度和成本。"},
      {term:"permissions",def:"控制 OpenCode 在你的机器上被允许做什么的规则。每个操作可以设置为 allow、ask 或 deny。"},
      {term:"prompt",def:"你在 OpenCode 中输入的消息或指令。一个好的提示词给 AI 足够的上下文来完成你想要的事情。"},
      {term:"provider",def:"托管 AI 模型的公司或服务。Anthropic、OpenAI 和 Google 都是提供商。OpenCode 支持 75+ 提供商。"},
      {term:"session",def:"与 OpenCode 的一次对话。每个会话有自己的上下文和历史。你可以并行运行多个会话并与他人分享。"},
      {term:"skill",def:"以 SKILL.md 文件包装的可重用指令集。当技能与当前任务相关时，OpenCode 会按需加载。"},
      {term:"tool",def:"OpenCode AI 代理可以使用的能力。内置工具包括读取文件、编辑代码、运行 shell 命令等。"},
      {term:"TUI",def:"终端用户界面。在终端内运行的基于文本的界面。OpenCode 的 TUI 看起来像聊天应用，但完全在终端中运行。"},
      {term:"branch",def:"你项目的并行版本。分支让你尝试更改而不影响主代码库。"},
      {term:"commit",def:"你项目在某个时间点的保存快照。每个提交都有一个消息描述更改了什么和为什么。"},
      {term:"fork",def:"别人仓库的副本，存在你自己的 GitHub 账户中。Fork 让你实验更改而不影响原始仓库。"},
      {term:"repository",def:"Git 跟踪的文件夹 — 包含你的项目文件和完整历史。也叫 repo。"}
    ];
    var h="";
    terms.forEach(function(t){
      h+='<div class="glossary-entry" id="glossary-'+t.term.replace(/[^a-z0-9]/gi,"-")+'"><h3>'+t.term+'</h3><p>'+t.def+'</p></div>';
    });
    return h;
  };

  SP.contributing=function(){
    return'<p>你的体验塑造本课程。如果有什么令人困惑、损坏或缺失，或者你想到了让 OpenCode 学校更好的主意，我们希望听到。</p><p>你能做的最有价值的事是<strong>在 GitHub 上告诉我们</strong>。你不需要懂 Git 或编程。一个免费的 GitHub 账户和简短描述就够了。</p><h2 id="something-isnt-working">有些东西不工作或令人困惑</h2><p>遇到障碍？指令与你看到的不符？告诉我们发生了什么、在哪里、以及你期望什么。</p><p><a href="https://github.com/opencodeschool/opencode.school/issues/new?title=Something%20isn%27t%20working%20or%20is%20confusing%3A%20&body=What%20happened%3A%0A%0AWhat%20I%20expected%3A%0A%0AWhere%20%28lesson%2C%20exercise%2C%20or%20page%29%3A%0A" class="theme-button" style="display:inline-block;padding:0.5rem 1rem;text-decoration:none;">报告问题 \u2192</a></p><h2 id="you-have-an-idea">你有改进学校的主意</h2><p>希望课程用不同的方式解释？想要覆盖新主题？开一个 issue 描述你的想法。</p><p><a href="https://github.com/opencodeschool/opencode.school/issues/new?title=Idea%3A%20&body=What%20would%20make%20OpenCode%20School%20better%3A%0A%0AWhy%20this%20would%20help%20students%3A%0A" class="theme-button" style="display:inline-block;padding:0.5rem 1rem;text-decoration:none;">建议一个主意 \u2192</a></p><h2 id="you-came-up-with-an-exercise">你想到了值得分享的提示词或练习</h2><p>如果你发现了一个效果出乎意料好的提示词，在 issue 中描述它。你不必自己编写练习。</p><p><a href="https://github.com/opencodeschool/opencode.school/issues/new?title=Exercise%20idea%3A%20&body=What%20the%20exercise%20would%20teach%3A%0A%0AA%20prompt%20or%20starting%20point%20that%20worked%20well%3A%0A" class="theme-button" style="display:inline-block;padding:0.5rem 1rem;text-decoration:none;">提议一个练习 \u2192</a></p><h2 id="going-further">更进一步：提交拉取请求</h2><p>提交 issue 是你能做的最有价值的事。如果你想更进一步， <a href="#/exercises/use-git-and-github" class="theme-link">Use Git and GitHub</a> 练习将引导你完成 fork 仓库和创建拉取请求。</p>';
  };

  // ---- Page Renderers ----
  function getHomePageHTML(){
    var sid=school.getStudentId();
    var enrolled=!!sid;
    var h='';

    if(enrolled){
    }

      h+='<div class="page-header"><p class="page-intro">欢迎回来！继续你的 OpenCode 学习之旅。</p></div>';

    if(enrolled){
      var completedCount=0;LESSONS.forEach(function(l){if(school.isLessonComplete(l.slug))completedCount++;});
      var progressPct=Math.round(completedCount/LESSONS.length*100);
      h+='<div id="enrolled-section" class="enrolled-section"><h2 class="section-label">课程 <span style="font-weight:400;color:var(--text-tertiary);">('+completedCount+'/'+LESSONS.length+' 已完成 · '+progressPct+'%)</span></h2><ol class="lesson-list">';
      LESSONS.forEach(function(l){
        var complete=school.isLessonComplete(l.slug);
        var visited=school.isLessonVisited(l.slug);
        var nextIncomplete=false;var isNext=false;
        var idx=LESSONS.indexOf(l);
        for(var j=0;j<idx;j++){if(!school.isLessonComplete(LESSONS[j].slug)){nextIncomplete=true;break;}}
        if(!complete&&!nextIncomplete){isNext=true;nextIncomplete=true;}
        h+='<li data-lesson-slug="'+l.slug+'" data-lesson-stub="false"><div class="lesson-row'+(isNext?' lesson-row--next':'')+'"><a href="#/lessons/'+l.slug+'" class="lesson-link"><span class="lesson-status'+(complete?' lesson-status--complete':'')+'"><span class="lesson-status-dot'+(complete?' hidden':'')+'"></span><span class="lesson-check'+(complete?'':' hidden')+'">\u2713</span></span><div class="lesson-info"><h3 class="lesson-title"><span class="lesson-num">'+l.num+'.</span> '+l.title+'</h3><p class="lesson-description">'+l.desc+'</p></div></a><a href="#/lessons/'+l.slug+'" class="lesson-cta theme-button'+(isNext?'':' hidden')+'">'+(visited?"继续":"开始")+'</a></div></li>';
      });
      h+='</ol><h2 class="section-label" style="margin-top:2rem;">练习</h2><p class="section-description">动手项目，应用所学知识构建真实作品。</p><ol class="lesson-list">';
      EXERCISES.forEach(function(e){
        var complete=school.isExerciseComplete(e.slug);
        h+='<li data-exercise-slug="'+e.slug+'"><div class="lesson-row"><a href="#/exercises/'+e.slug+'" class="lesson-link"><span class="lesson-status'+(complete?' lesson-status--complete':'')+'"><span class="lesson-status-dot'+(complete?' hidden':'')+'"></span><span class="lesson-check'+(complete?'':' hidden')+'">\u2713</span></span><div class="lesson-info"><h3 class="lesson-title">'+e.title+'</h3><p class="lesson-description">'+e.desc+'</p></div></a></div></li>';
      });
      h+='</ol></div>';
    } else {
      h+='<div id="enrollment-section" class="enrollment-section"><h2 class="enrollment-title rainbow-bg">注册 OpenCode 学校</h2><p class="enrollment-subtitle">永久免费。无需账户。不收集个人数据。</p><p class="enrollment-color-label">为你的网站主题选择一种颜色。</p><div id="color-picker" class="color-picker">';
      var swatchColors=["blue","#2563eb","indigo","#4f46e5","violet","#7c3aed","purple","#9333ea","fuchsia","#c026d3","pink","#db2777","rose","#e11d48","red","#dc2626","orange","#ea580c","amber","#b45309","yellow","#ca8a04","lime","#4d7c0f","green","#15803d","emerald","#059669","teal","#0f766e","cyan","#0e7490","sky","#0284c7","slate","#475569"];
      for(var i=0;i<swatchColors.length;i+=2){
        h+='<button class="color-swatch" data-color="'+swatchColors[i]+'" style="--swatch-color:'+swatchColors[i+1]+';--i:'+(i/2)+'" title="'+swatchColors[i]+'"></button>';
      }
      h+='</div><div id="enrollment-error" class="enrollment-error hidden">出了点问题。请重试。</div><button id="enroll-button" class="enroll-button theme-button"><span id="enroll-button-text">注册</span><span id="enroll-button-spinner" class="spinner hidden"></span></button></div>';

      h+='<div id="content-sections" class="content-sections"><div class="prose-section"><h2>OpenCode 是什么？</h2><p><a href="https://opencode.ai" class="theme-link">OpenCode</a> 是一个免费的开源 AI 编码代理，你安装在个人电脑上。主要界面是一个聊天窗口，就像 ChatGPT 或 Claude 一样，你与 AI 模型进行来回对话。但不仅仅是聊天，OpenCode 可以读写你电脑上的文件、编写代码、运行命令以及与其他应用程序交互。</p><p>与 Claude Code 和 OpenAI Codex 等专有工具不同，OpenCode 支持 <a href="https://opencode.ai/docs/providers/" class="theme-link">75+ AI 模型提供商</a>，包括 <a href="https://anthropic.com" class="theme-link">Anthropic</a> (Claude)、<a href="https://openai.com" class="theme-link">OpenAI</a> (GPT) 和 <a href="https://deepmind.google/technologies/gemini/" class="theme-link">Google</a> (Gemini)。</p></div><div class="prose-section"><h2>谁适合这个课程？</h2><p>本课程适合任何希望用 AI 扩展创造力的人。 无论你是学生、爱好者、专业开发者，还是对 AI 好奇，OpenCode 都能帮你事半功倍。</p><p>本课程适合刚接触 AI 编码代理的<strong>初学者</strong>。你不需要是程序员，也不需要任何终端经验。</p><p>本课程也适合<strong>有经验的开发者</strong>。它将帮你建立有效使用 OpenCode 的良好基础。</p></div><div class="prose-section"><h2>你将学到什么</h2><ul><li>安装和配置 OpenCode</li><li>使用 AI 模型帮助你编写和编辑代码</li><li>控制 OpenCode 在你的机器上能做什么和不能做什么</li><li>连接外部工具和服务</li><li>并行运行多个会话</li><li>构建网站、游戏和其他创意项目！</li></ul></div><div class="prose-section"><h2>它如何运作</h2><p>第一课 \u2014 安装 \u2014 在浏览器中完成。一旦你启动并运行 OpenCode，其余课程将在 OpenCode 内部交互式进行。每个课程页面都有一个提示词，你可以复制粘贴到 OpenCode 中。</p></div></div>';
    }
    return h;
  }

  function getLessonPageHTML(slug){
    var l=lessonBySlug(slug);if(!l)return'<p>未找到课程。</p>';
    return'<a href="#/" class="back-link">\u2190 所有课程</a>'+completedBanner(slug,"课程")+enrollmentBanner()+'<h1>'+l.num+'. '+l.title+'</h1><p class="page-description">'+l.desc+'</p><div class="prose">'+(LC[slug]?LC[slug]():'<p>内容即将推出。</p>')+'</div>'+navLinks(slug,"课程");
  }

  function getExercisePageHTML(slug){
    var e=exerciseBySlug(slug);if(!e)return'<p>未找到练习。</p>';
    return'<a href="#/" class="back-link">\u2190 所有练习</a>'+completedBanner(slug,"练习")+enrollmentBanner()+'<h1>'+e.title+'</h1><p class="page-description">'+e.desc+'</p><div class="prose">'+(EC[slug]?EC[slug]():'<p>内容即将推出。</p>')+'</div>'+navLinks(slug,"练习");
  }

  function getStaticPageHTML(slug){
    var p=null;STATIC_PAGES.forEach(function(s){if(s.slug===slug)p=s;});
    if(!p)return'<p>未找到页面。 <a href="#/" class="theme-link">返回首页</a></p>';
    return'<a href="#/" class="back-link">\u2190 所有课程</a><h1>'+p.title+'</h1><div class="prose">'+(SP[slug]?SP[slug]():'')+'</div>';
  }

  // ---- Router ----
  function updateSidebarActive(route){
    document.querySelectorAll(".sidebar-nav li").forEach(function(li){li.classList.remove("active");});
    if(!route||route==="/"){
      document.querySelector(".sidebar-logo").classList.add("active");
    } else {
      var sel="";
      if(route.indexOf("/lessons/")===0)sel='[data-sidebar-slug="'+route.replace("/lessons/","")+'"]';
      else if(route.indexOf("/exercises/")===0)sel='[data-sidebar-exercise-slug="'+route.replace("/exercises/","")+'"]';
      else sel='[data-sidebar-page="'+route.replace("/","")+'"]';
      var el=document.querySelector(sel);
      if(el)el.classList.add("active");
    }
  }

  function navigate(route){
    var mainEl=document.getElementById("main-content");if(!mainEl)return;
    if(!route||route==="/"){mainEl.innerHTML=getHomePageHTML();initHomePage();}
    else if(route.indexOf("/lessons/")===0){mainEl.innerHTML=getLessonPageHTML(route.replace("/lessons/",""));initDetailPage();}
    else if(route.indexOf("/exercises/")===0){mainEl.innerHTML=getExercisePageHTML(route.replace("/exercises/",""));initDetailPage();}
    else{mainEl.innerHTML=getStaticPageHTML(route.replace("/",""));initDetailPage();}
    window.scrollTo({top:0,behavior:"smooth"});
    updateSidebarActive(route);
    if(mobileMenuOpen)toggleMobileMenu();
  }

  function initHomePage(){
    var sid=school.getStudentId();if(!sid){
      document.querySelectorAll(".color-swatch").forEach(function(s){
        s.addEventListener("click",function(){school.setThemeColor(this.getAttribute("data-color"));});
      });
      updateSwatchSelection(school.getThemeColor());
      var enrollBtn=document.getElementById("enroll-button");
      if(enrollBtn)enrollBtn.addEventListener("click",function(){window._schoolEnroll();});
      return;
    }
    school.updateAllCheckmarks();
  }

  function initDetailPage(){
    // System check on installation page
    var osEl=document.getElementById("sys-os");
    if(osEl){
      var ua=navigator.userAgent;
      if(ua.indexOf("Mac")!==-1)osEl.textContent="macOS";
      else if(ua.indexOf("Win")!==-1)osEl.textContent="Windows";
      else if(ua.indexOf("Linux")!==-1)osEl.textContent="Linux";
      else osEl.textContent="未知";
    }
    var cpuEl=document.getElementById("sys-cpu");
    if(cpuEl)cpuEl.textContent=navigator.hardwareConcurrency?navigator.hardwareConcurrency+" 核":"已检测";
    var memEl=document.getElementById("sys-mem");
    if(memEl)memEl.textContent=navigator.deviceMemory?navigator.deviceMemory+" GB":"已检测";
    var netEl=document.getElementById("sys-net");
    if(netEl)netEl.textContent=navigator.onLine?"已连接":"离线";

    // Copy buttons
    document.querySelectorAll(".prompt-copy-btn").forEach(function(btn){
      btn.addEventListener("click",function(){
        var text=this.getAttribute("data-copy");
        navigator.clipboard.writeText(text).then(function(){
          btn.textContent="已复制!";setTimeout(function(){btn.textContent="复制";},2000);
        });
      });
    });

    // Code block copy
    document.querySelectorAll(".prose pre").forEach(function(pre){
      var btn=document.createElement("button");btn.className="code-copy-btn";btn.textContent="复制";
      btn.addEventListener("click",function(){
        var code=pre.querySelector("code");
        var text=code?code.textContent:pre.textContent;
        navigator.clipboard.writeText(text).then(function(){btn.textContent="已复制!";setTimeout(function(){btn.textContent="复制";},2000);});
      });
      pre.style.position="relative";pre.appendChild(btn);
    });

    // Mark complete button
    document.querySelectorAll(".mark-complete-btn").forEach(function(btn){
      btn.addEventListener("click",function(){
        var slug=this.getAttribute("data-mark-complete");
        var type=this.getAttribute("data-mark-type");
        if(type==="课程")school.markComplete(slug);
        else school.markExerciseComplete(slug);
        this.outerHTML='<div class="mark-complete-done">\u2713 已完成</div>';
      });
    });
  }

  // ---- Init ----
  function init(){
    cacheDom();

    // Mobile menu
    if(menuToggle)menuToggle.addEventListener("click",toggleMobileMenu);
    if(sidebarOverlay)sidebarOverlay.addEventListener("click",function(){if(mobileMenuOpen)toggleMobileMenu();});

    // Search
    if(searchTrigger)searchTrigger.addEventListener("click",openSearch);
    var mobileSearchTrigger=document.getElementById("mobile-search-trigger");
    if(mobileSearchTrigger)mobileSearchTrigger.addEventListener("click",openSearch);
    if(searchModalBackdrop)searchModalBackdrop.addEventListener("click",closeSearch);
    if(searchInput)searchInput.addEventListener("input",function(){renderSearchResults(this.value);});

    // Search results clicks - close modal on click
    document.getElementById("search-results").addEventListener("click",function(e){
      var a=e.target.closest("a");if(a)closeSearch();
    });

    // Keyboard shortcuts
    document.addEventListener("keydown",function(e){
      if((e.metaKey||e.ctrlKey)&&e.key==="k"){e.preventDefault();if(searchModal.classList.contains("hidden"))openSearch();else closeSearch();}
      if(e.key==="Escape"&&!searchModal.classList.contains("hidden"))closeSearch();
    });

    // Dark mode
    if(darkToggle)darkToggle.addEventListener("click",function(){var isDark=document.documentElement.classList.toggle("dark");localStorage.setItem("darkMode",isDark?"true":"false");});

    // Router
    window.addEventListener("hashchange",function(){
      navigate(location.hash.replace("#","")||"/");
    });

    // Initial navigation
    navigate(location.hash.replace("#","")||"/");
  }

  // Expose for enrollment flow (called from inline onclick or external)
  window._schoolEnroll=function(){
    var enrollBtn=document.getElementById("enroll-button");
    var enrollBtnText=document.getElementById("enroll-button-text");
    var enrollBtnSpinner=document.getElementById("enroll-button-spinner");
    var enrollmentError=document.getElementById("enrollment-error");
    if(!enrollBtn)return;

    enrollBtn.classList.add("loading");enrollBtnText.classList.add("hidden");enrollBtnSpinner.classList.remove("hidden");
    if(enrollmentError)enrollmentError.classList.add("hidden");

    school.enroll().then(function(data){
      navigate("/");
      setTimeout(function(){fireCelebration();},300);
    }).catch(function(){
      enrollBtn.classList.remove("loading");enrollBtnText.classList.remove("hidden");enrollBtnSpinner.classList.add("hidden");
      if(enrollmentError)enrollmentError.classList.remove("hidden");
    });
  };

  init();

})();
