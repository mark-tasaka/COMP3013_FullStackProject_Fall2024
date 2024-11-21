import {posts} from "../../../../backend/fakedb.ts"
import classes from './Landpage.module.css';


export function LandingPageImage()
{
    const coverImage = posts[0][4];

    return(
    <div className={classes.imageTextFormat}>
      <span>
          <img src="https://cdn.pixabay.com/photo/2017/02/07/16/47/kingfisher-2046453_640.jpg" 
            className={classes.imageStyle}/>  
         </span>

         <span>
            The Full Stack Lab is designed to emulate a photo sharing website, where a database has been created to hold ‘fake’ data, which includes usernames/passwords and sample posts.  The program is designed to allow users to login using one of the store accounts, and uploads photos and details about these photos.
        </span>
    </div>
    );

}
