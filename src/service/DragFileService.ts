
class DragFileService{

  public static dragoverHandler(e:DragEvent){
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer!.dropEffect = "copy";
  };

  public static dropHandler(e:DragEvent,readType:"text"|"buffer",cb:(res:string | ArrayBuffer | null | undefined)=>void){
    e.preventDefault();
    e.stopPropagation();
    if(!e.dataTransfer) throw new Error("dataTransfer is null");
    const files = e.dataTransfer.files;
    if(files.length>0){
      const file = files[0];
      const reader = new FileReader();
      reader.onload = function(e){
        const result = e.target?.result;
        console.log(result, file.name, file.size, file.type);
        cb(result);
      };
      readType==="buffer" && reader.readAsArrayBuffer(file);
      readType==="text" && reader.readAsText(file);
    }
  }

}

export default DragFileService;