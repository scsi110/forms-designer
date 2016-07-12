$(function () {

    var $treeDemo = $('#treeDemo');

    var zNodes = [
//        {
//            name: "视图1",
//            open: true,
//            children: [
////                    可以在这自定义数据
//                {name: "test1_1", ddd: 'ggg'},
//                {name: "test1_2"}
//            ]
//        }
//        {
//            name: "test2",
//            open: true,
//            children: [
//                {name: "test2_1"},
//                {name: "test2_2"}
//            ]
//        }
    ];

// zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
    var setting = {
        edit: {
            enable: true,
            drag: {
                isCopy: true,
                isMove: false
            },

            showRemoveBtn: true,
            showRenameBtn: true
        },
        callback: {
//            点击高亮
            onClick: function (event, treeId, treeNode) {
                $('iframe').contents().find('.focus').removeClass('focus');
                $('iframe').contents().find('.editorComp_' + (treeNode.id - 100)).addClass('focus');
            },

            onDragMove: function (event, treeId, treeNode) {
                console.log(event.target);
            },

//            右键菜单
            onRightClick: function (event, treeId, treeNode) {
                if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
                    zTreeObj.cancelSelectedNode();
                    showRMenu("root", event.clientX, event.clientY);
                } else if (treeNode && !treeNode.noR) {
                    zTreeObj.selectNode(treeNode);
                    showRMenu("node", event.clientX, event.clientY);
                }
            },

//            重命名
            onRename: function (event, treeId, treeNode, isCancel) {
                console.log(treeNode)
                var id = treeNode.id - 100;
                var newName = treeNode.name;
                if (!treeNode.isParent) {
//                    不是文件夹
                    $('iframe').contents().find('.editorComp_' + id).find('.name').val(newName);
                }

                if(treeNode.level === 0){
                    //表示是树形结构的第一级,也即是视图区
                    $('.editorComp_'+id).find('span').html(newName);
                }

            }
        }
    };

    //        域结构初始化
    var zTreeObj = $.fn.zTree.init($treeDemo, setting, zNodes);

    //    动态增加一个子节点
    $treeDemo.on('addTag', function (e, args) {

        if (!args) {
            args = {};
            args.isParent = e.isParent;
            args.name = e.name;
            args.nodes = e.nodes;
        }

        var treeNode = args.nodes;

        if (treeNode) {
            treeNode = zTreeObj.addNodes(treeNode, {
                id: (100 + newCount),
                pId: treeNode.id,
                isParent: args.isParent,
                name: args.name + (newCount++)
            });
        } else {
            treeNode = zTreeObj.addNodes(null, {
                id: (100 + newCount),
                pId: 0,
                isParent: args.isParent,
                name: args.name + (newCount++)
            });
        }
        if (treeNode) {
//                zTreeObj.editName(treeNode[0]);
        } else {
            alert("叶子节点被锁定，无法增加子节点");
        }

        return treeNode;
    })

    //        域结构中右键插入一个组件
    function addComponent() {
        var treeNode = zTreeObj.getSelectedNodes();

        var html = $('iframe').contents().find('.editorComp_' + (treeNode[0].id - 100))[0].outerHTML;

        window.editor[0].execCommand('inserthtml', html);
    }

//        默认增加视图1
    $treeDemo.trigger('addTag', {isParent: true, name: '视图', nodes: undefined});

    //        $("#addParent").on("click", {isParent:true}, add);
    //        $("#addLeaf").on("click", {isParent:false}, add);

    //    点击子节点选中相应组件

    //    双击弹窗设置








    function showRMenu(type, x, y) {
        $("#rMenu ul").show();
        if (type == "root") {
            $("#m_del").hide();
            $("#m_check").hide();
            $("#m_unCheck").hide();
        } else {
            $("#m_del").show();
            $("#m_check").show();
            $("#m_unCheck").show();
        }
        $("#rMenu").css({"top": y + "px", "left": x + "px", "visibility": "visible"});

        $("body").on("mousedown", onBodyMouseDown);
    }

    function hideRMenu() {
        if ($("#rMenu")) $("#rMenu").css({"visibility": "hidden"});
        $("body").off("mousedown", onBodyMouseDown);
    }

    function onBodyMouseDown(event) {
        if (!(event.target.id == "rMenu" || $(event.target).parents("#rMenu").length > 0)) {
            $("#rMenu").css({"visibility": "hidden"});
        }
    }


    //保留给外部使用
    window.domainStructure = {
        addComponent: addComponent,
        zTreeObj: zTreeObj
    }
});