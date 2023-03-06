var send = document.getElementById('send');
var content = document.getElementById('content');
var list = document.getElementById('list');

send.addEventListener('click',function(e){
    var str = content.value;
    var xhr = new XMLHttpRequest();
    xhr.open('post',"/addTodo");
    xhr.setRequestHeader('Content-type',"application/json")
    var todo = JSON.stringify({"content":str});
    xhr.send(todo);
    xhr.onload = function(){
        var originData = JSON.parse(xhr.responseText);
        if(originData.success == false){
            alert(originData.message);
            return;
        }
        var data = originData.result;
        var str = '';
        for(item in data){
            str+='<li>'+data[item].content+' <input type="button" value="刪除" data-id="'+item+'" /></li>'
        }
        list.innerHTML = str;
    }
})


list.addEventListener('click',function(e){
    if(e.target.nodeName !=='INPUT'){
        return;
    }
    var id = e.target.dataset.id;
    var xhr = new XMLHttpRequest();
    xhr.open('post','/removeTodo');
    xhr.setRequestHeader('Content-type','application/json');
    var removeTodo = JSON.stringify({"id":id});
    xhr.send(removeTodo);
    xhr.onload = function(){
        var originData = JSON.parse(xhr.responseText);
        var data = originData.result;
        var str = '';
        for(item in data){
            str+='<li>'+data[item].content+' <input type="button" value="刪除" data-id="'+item+'" /></li>'
        }
        list.innerHTML = str;
    }
})

