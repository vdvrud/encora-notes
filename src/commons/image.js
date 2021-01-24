import multer from 'multer';
const notesFolder = '/src/public/notes/';


const uploadFile = (path) => {
    return multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, process.cwd() + path)
      },
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '')}`)
      },
      
    });
  };


  const folders = [
    notesFolder
  ]

  const noteUpload = multer({ storage: uploadFile(notesFolder) });

  const createUrl = (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    req.url = url;
    next()
  }


export {
      folders, noteUpload, notesFolder, createUrl
  }