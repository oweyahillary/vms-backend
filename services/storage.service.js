const {createClient}=require('@supabase/supabase-js');
const supabase=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_KEY);

exports.uploadBase64=async(base64,path)=>{
 try{
  const buffer=Buffer.from(base64.split(',')[1],'base64');
  const {error}=await supabase.storage.from('visitor-files').upload(path,buffer,{contentType:'image/png'});
  if(error) throw error;
  return `${process.env.SUPABASE_URL}/storage/v1/object/public/visitor-files/${path}`;
 }catch(e){
  console.error("upload failed",e.message);
  return null;
 }
};
