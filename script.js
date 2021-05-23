var i=5;
var max = 10;
var count = 0;
function main(){
    setTimeout(() => {
        window.scroll({
            top: 999999999999999,
            left: 100,
            behavior: 'smooth'
        });
        var all = document.getElementsByTagName("a");
        while(i<all.length){
                if(all[i].href.match(/facebook\.com\/.*\/videos\/[0-9]/g) && !all[i].href.includes('?notif')){
                    console.log(`http://localhost:6543/getlink?url=${all[i].href}`);
                    count++;
                    let newWindows = window.open(`http://localhost:6543/?url=${all[i].href}`);
                    setTimeout(()=>{
                        newWindows.close();
                    },30000);
                    i++;
                   break;
                }
                i++;
            // break;
        }
        if(count >= max) {
            console.log('done');
            return;
        }
        main();
    }, 1000);
}
main();