project.ini();

// 导航点击
$('#listNav').on('click', 'li', function() {
    project.typeChg($(this))
});

// 筛选选项点击
$('#listSel').on('click', 'label', function() {
    project.filter($(this))
});

// 清除条件
$('#clear').on('click', function() {
    project.clear()
});
$('#filter').on('click', '.i-close', function() {
    project.clearOne($(this))
})
