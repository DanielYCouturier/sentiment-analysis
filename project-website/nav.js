const iframe = document.getElementById('embedFrame')
const loadOverlay = document.getElementById('loadingOverlay')
const homeFrame = document.getElementById('home-frame')
const links = document.querySelectorAll('a');
var prevID = "";
links.forEach((link) => {
  link.addEventListener('click', function(event) {
    event.preventDefault(); 
    changeSrc(link);
  });
});


function changeSrc(link) { 
    const [nav, navid] = link.id.split(/-(.+)/, 2);
    if(prevID==navid){
        return;
    }
    prevID=navid;
    switch (navid) { 
        case "1-1":
            src = 'https://docs.google.com/document/d/1X2AQWjb2NknODAyLLswdYfaJWipSsbBVmmu3VmNvOhg/pub?embedded=true';
            break;
        case "1-2":
            src = 'https://docs.google.com/presentation/d/1Oi-E7b3SzIUhrzlpsfD1I8I3tUNIMBHDC2c88QaE5P0/embed?start=false&loop=false&delayms=3000';
            break;
        case "2-1":
            src = 'https://docs.google.com/document/d/e/2PACX-1vQeIimE5OrrdPibAuFVjbs2sA5Qcp-bzfdefHOH4bAIx9si86aaBJ3HOd3Fm4OTG14ISCjs5N33j0XN/pub?embedded=true'
            break
        case "2-2":
            src = 'https://docs.google.com/document/d/e/2PACX-1vQYBZ0oWxVmQomyDaH5uEMfVgyjVp735DR5oFSCkdC3_KxQqgeEUJ0QyJ1VlbNE6t4D3oqsrXMtK3aZ/pub?embedded=true'
            break
        case "2-3":
            src = 'https://docs.google.com/document/d/e/2PACX-1vTcCx8Cli4o9jTtaWGf3IYaE_kS3Cry3gM5evu63OIpAUHjYTpYzagcaq5dfdlPOQ3W29ioq_hmY5Gl/pub?embedded=true'
            break
        case "2-4":
            src = 'https://docs.google.com/presentation/d/e/2PACX-1vTm0U1sJZH0OTheMNDAn645bD_2qANA2ti9Hp6Fz5cH23OY3XF-VEUwK8-aHQfAkzOMDfz7o1HBGiFn/embed?start=false&loop=false&delayms=3000'
            break
        case "2-5":
            src = 'https://docs.google.com/document/d/e/2PACX-1vTbGLjqaxVgJHjf8XAMzGx2Z1v8AzbBE0zguOW-WkhmW2OqInVmJY_kqHjiUbFT0jTH8wKk-O73ktf6/pub?embedded=true'
            break
        case "3-1":
            src = "https://docs.google.com/presentation/d/e/2PACX-1vSlfvXuh9OnNgOHAZFfTekH5NYp9eKvTaWJWqQNmzE5Q-hJCSd-mMx55w4Ft-RhUCIh9s_tnrEFwbh0/embed?start=false&loop=false&delayms=3000"
            break
        case "3-2":
            src = "https://docs.google.com/document/d/e/2PACX-1vT5hwF-rLCVF6fnKHV3kdjXxtksldxeBMLkQXs0F6jM7VothG6sO9lwy6h-fq3YhBZoPhOZjJJLQHij/pub?embedded=true"
            break
        case "4-1":
            src = "https://docs.google.com/presentation/d/e/2PACX-1vRLyoKopauzVA_6K1-WgXms-Gzu_oqiOMxH6-cz1t9gHU85hvS5lb9fIS9WmFba0DhVJOy_tEK4FmQ_/embed?start=false&loop=false&delayms=3000"
            break
        case "4-2":
            src = "https://docs.google.com/document/d/e/2PACX-1vQjV_X3rUEodMKcQ1uVDAz26hO9RLaxOoTs4Ob9P9JE1SN66BuX1_xg53lpNe08vxSp54Z4HP0q2EwD/pub?embedded=true"
            break
        case "5-1":
            src = "https://docs.google.com/document/d/e/2PACX-1vRtC_59RrJpHiglbuV3Sqar_Z1AWGzeRCfmg22tipFQPpOeO77ZULzPoKYFA3HN-8EbMHY_U3ZPwpu2/pub?embedded=true"
            break
        case "5-2":
            src = "https://docs.google.com/presentation/d/e/2PACX-1vRB7y-wxrzfc_zhkoEFEl6bO7dcGxNlvw2u7W05ZUJ1yzj8heUnknXASLY0xMx-u9cZlWrX5aF7s-3S/embed?start=false&loop=false&delayms=3000"
            break
        default:
            src = null;
            break;
    }
    element = link
    // when loading a document...
    if(src!=null){
    // cover iframe with loading...
    loadOverlay.style.display = 'flex';
    // then wait 50ms and delete old iframe...
    setTimeout(function () {
        iframe.style.display = 'none';
        homeFrame.style.display = 'none'
    }, 50);
    iframe.src = src
    }else{
        homeFrame.style.display = 'flex'
        iframe.style.display = 'none';
    }
    // // finally, update top bar links to set new page as active link
    // links.forEach(function (link) {
    //     link.classList.remove('active');
    // });
    // element.classList.add('active');
}
function onLoadComplete() {
    // when loading complete, show iframe, wait 50ms, then remove cover.
    document.getElementById('embedFrame').style.display = 'flex';
    setTimeout(function () {
        document.getElementById('loadingOverlay').style.display = 'none';
    }, 50);

}
window.onload = function () {
    // init active src for iframe
    const planDocumentLink = document.getElementById('defaultPage');
    changeSrc('plan-home', planDocumentLink);
}