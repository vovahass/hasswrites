function replyTo(name,number) {
    document.getElementById("body").value= `Reply to (#${number}), ${name}:\x0D`;
    document.getElementById("body").focus();
}