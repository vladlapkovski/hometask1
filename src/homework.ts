import express, { Request, Response } from "express"
import bodyParser from "body-parser"

export const app = express()
const port = process.env.PORT || 3000
const videos = [
{id: 1, title: "nigth show", author: "dimych", "canBeDownloaded": true, "minAgeRestriction": null,"createdAt": new Date().toISOString(), "publicationDate": new Date(Date.now() + 86400000).toISOString(), "availableResolutions": ["P144"]}, 


{id: 2, title: "kuchna", author: "kto-to", "canBeDownloaded": true, "minAgeRestriction": null, "createdAt": new Date().toISOString(), "publicationDate": new Date(Date.now() + 86400000).toISOString(), "availableResolutions": ["P144"]}
]


let resolution = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"]

const parserMiddleware = bodyParser({})
app.use(parserMiddleware)


app.get("/hometask_01/api/videos", (req: Request, res: Response) => {
    res.send(videos)
})

app.get("/hometask_01/api/videos/:videoId", (req: Request, res: Response) => {
    let video = videos.find(v => v.id === +req.params.videoId)
    if(video) {
        res.send(video)
    } else {
        res.send(404)
    }
    
})

app.delete("/hometask_01/api/videos/:videoId", (req: Request, res: Response) => {
    for (let i = 0; i < videos.length; i++) {
       if (videos[i].id === +req.params.videoId) {
            videos.splice(i, 1);
            res.send(204);
            return;
       }
    }   
    res.send(404)
})

app.delete("/hometask_01/api/testing/all-data", (req: Request, res: Response) => {     
    videos.length = 0;
    res.send(204);        
})

app.post('/api/validate-resolution', (req, res) => {
    const resolution = req.body.resolution;
    const availableResolutions = req.body.availableResolutions;
  
    if (!resolution || !availableResolutions) {
      return res.status(400);
    }
  
    if (typeof resolution !== 'string' || !Array.isArray(availableResolutions)) {
      return res.status(400);
    }
  
    const isValid = req.body.availableResolutions.every((r: string) => resolution.includes(r));
  
    if (!isValid) {
      return res.status(400);
    }
  
    return res.status(200);
  });

  app.put("/hometask_01/api/videos/:videoId", (req: Request, res: Response) => {
    let video = videos.find(v => v.id === +req.params.videoId)
    if (req.body.title.length > 40 || req.body.author.length > 20 || req.body.availableResolutions.length < 1 || !req.body.availableResolutions.every((r: string) => resolution.includes(r)) || typeof(req.body.canBeDownloaded) !== "boolean" || req.body.minAgeRestriction < 1 || req.body.minAgeRestriction > 18) {
        res.sendStatus(400)
    } else if (video) {
        video.title = req.body.title,
        video.author = req.body.author,
        video.availableResolutions = req.body.availableResolutions,
        video.canBeDownloaded = req.body.canBeDownloaded,
        video.minAgeRestriction = req.body.minAgeRestriction,
        video.publicationDate = new Date(Date.now() + 86400000).toISOString()
        res.status(204).send(video)
    } else {
        res.sendStatus(404)
    }
})

app.listen(port, () => {
    console.log(`app listening on port: ${port}`)
})