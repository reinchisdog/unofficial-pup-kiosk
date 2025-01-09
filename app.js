const names = [];
const description = [
    "PUP's open air stage, often used by students for events, hanging out, and eating lunch.",
    "The headquarters of the band that plays music using instruments made of bamboo.",
    "Office managing the upkeep, repair, and cleanliness of campus facilities and grounds.",
    "A long walkway that introduces the atmosphere of the campus, where a lot of students meet and gather before heading into the campus.",
    "The Intramuros-like entrance to PUP's Lagoon and Food Area that commemorates the celebreation of the institution's 100th anniversary, symbolizing its legacy and history.",
    "Used by the Central Student Council, student organizations, cultural groups, and student publications",
    "The entrance to PUP's Oval Field Area.",
    "Showcases the Philippine Flag. Often a focal point during ceremonies.",
    "PUP Oval's stage for performming events that can also serve as a place for the audience to sit during events that take place in the Oval itself.",
    "The area where PUP holds its large events and sport competitions, mainly for Basketball, Badminton, and Volleyball.",
    "An Interfaith Chapel is a sacred space designed to provide a welcoming environment for people of all faiths and beliefs to come together for prayer, reflection, and meditation, fostering spiritual growth, understanding, and respect for diversity.",
    "It is the area for holding the classes of PUP's outstanding high school students.",
    "The area for PUP Sta. Mesa's lagoon and the food court area filled with varying food items.",
    "The Section of the Main Building that connects all of its Wings together.",
    "The Main Building's extension in the East Area.",
    "The Main Building's extension in the North Area. (Currently Under Construction)",
    "The Main Building's extension in the South Area.",
    "The Main Building's extension in the West Area.",
    "PUP Sta. Mesa's Main Entrance, which holds the Pylon, Mural, and the University's name.",
    "A Park built in Nemesio E. Prudente's memory. (Currently Under Construction)",
    "PUP Sta. Mesa's library and study area.",
    "Previously PUP Sta. Mesa's Open Basketball and Volleyball court. Now converted into a tennis court.",
    "A facility dedicated to the study and research of nutrition, food science, and related disciplines. It typically houses laboratories, classrooms, and offices to support practical and theoretical education in food safety, dietetics, food processing, and health.",
    "PUP's Track and Field, Football, Baseball/Softball and events area.",
    "Facility dedicated to physical education, with equipment and spaces for fitness and training.",
    "One of the largest river in the Philippines. Connects multiple ferry line stations, including the Sta. Mesa Station.",
    "Sta. Mesa's Ferry station that allows travelling to multiple areas in Manila connected by the Pasig River.",
    "A walkway to another area of the campus that also houses the historic site that is noted for being the residence of Filipino military leader Apolinario Mabini who figured in the Philippine Revolution." ,
    "Linear Park's small canteen, mainly catered to PUP's laboratory high school students.", 
    "PUP's breezy hangout and rest area that includes the view of the Pasig River.",
    "PUP's Mural that illustrates the social, economic, industrial, technological, and cultural aspect of life with which man blends himself to develop an environment necessary to the progress of the nation.",
    "PUP's Iconic Obelisk that showcases the depicts the strength of the Polytechnic University of the Philippines as an institution of higher learning, promoting educational and moral aims which are fortified by a determined leadership with a clear vision for the Filipino youth and an efficient support system inspired by the virtues of public service.",
    "Facility managing campus assets, including transportation and equipment.",
    "Another of PUP's Iconic Monument that symbolizes truth, excellence, and wisdom.",
    "A campus facility, likely named after the national flower, housing specific offices or functions.",
    "Another hangout and rest area within the campus, that also has a small store for PUP's merchandise.",
    "An open space that holds the universities water sports events and competitions.",
    "An open space court for holding tennis competitions.",
    "Essential infrastructure for storing and supplying water across the campus.",
    "Another entrance near the campus gymnasium.",
    "The 4-storey Engineering and Science Research Center, designed by Filipino Architect Royal Pineda, is the central research building of PUP. It is occupied by the research institutes of the university and laboratories of the College of Computer and Information Sciences, the College of Engineering, and the Institute of Technology."   
]

const calculatePolygonCenter = (coords) => {
    const points = coords.split(',').map(Number);
    let sumX = 0, sumY = 0, numPoints = points.length / 2;

    for (let i=0; i<points.length; i+=2) {
        sumX += points[i];
        sumY += points[i+1];
    }

    const x = sumX/numPoints;
    const y = sumY/numPoints;

    return {x, y};
}

const calculateRectangleCenter = (coords) => {
    const [x1, y1, x2, y2] = coords.split(',').map(Number);

    const x = (x1+x2)/2;
    const y = (y1+y2)/2;

    return {x, y};
}

const calculateCircleCenter = (coords) => {
    const [x, y, r] = coords.split(',').map(Number);

    return {x, y};
}

// Function to scale the image map
const scaleImageMap = () => {
    //Resets Area Numbers for every DOM Changes
    if (document.querySelectorAll('.areaNumber')) {
        const areaNums = document.querySelectorAll('.areaNumber');

        areaNums.forEach(num => {
            num.remove();
        })
    }

    const container = document.querySelector('section');
    const img = document.querySelector('img[usemap]');
    const mapName = img.getAttribute('usemap').replace('#', '');
    const map = document.querySelector(`map[name="${mapName}"]`);
    const areas = map.querySelectorAll('area');

    const rect = img.getBoundingClientRect();
    const originalWidth = img.naturalWidth || img.width;
    const originalHeight = img.naturalHeight || img.height;
    const currentWidth = rect.width;
    const currentHeight = rect.height;

    const widthRatio = currentWidth / originalWidth;
    const heightRatio = currentHeight / originalHeight;

    areas.forEach(area => {
        if (!area.dataset.originalCoords) {
            area.dataset.originalCoords = area.coords;
        }

        const coords = area.dataset.originalCoords.split(',').map(Number);
        const scaledCoords = coords.map((value, index) =>
            Math.round(index % 2 === 0 ? value * widthRatio : value * heightRatio)
        );
        area.coords = scaledCoords.join(',');

        const newCoords = scaledCoords.join(',');

        let areaPos;
        if (area.shape === "poly") areaPos = calculatePolygonCenter(newCoords);
        else if (area.shape === "circle") areaPos = calculateCircleCenter(newCoords);
        else if (area.shape === "rect") areaPos = calculateRectangleCenter(newCoords);

        const areaNumContainer = document.createElement("div");
        const areaNum = document.createElement("p")
        areaNumContainer.classList.add("areaNumber");
        areaNumContainer.dataset.areaId = area.title;
        areaNum.textContent = area.title;
        areaNumContainer.style.top = `${areaPos.y}px`;
        areaNumContainer.style.left = `${areaPos.x+rect.left}px`;
        areaNumContainer.append(areaNum);
        container.append(areaNumContainer);
    });
}

const handleAreaHover = (numbers, areaId) => {
    const number = document.querySelector(`.areaNumber[data-area-id="${areaId}"]`);
    if (number) {
        number.style.height = "36px";
        number.style.width = "36px";
        number.style.zIndex = number.style.zIndex + 1;
    }
};

const handleAreaNotHover = (numbers, areaId) => {
    const number = document.querySelector(`.areaNumber[data-area-id="${areaId}"]`);
    if (number) {
        number.style.height = "32px";
        number.style.width = "32px";
        number.style.zIndex = number.style.zIndex - 1;
    }
};

const checkIfImageExists = (url, callback) => {
    const img = new Image();
    img.src = url;

    if (img.complete) {
        callback(true);
    } else {
        img.onload = () => {
            callback(true);
        }

        img.onerror = () => {
            callback(false);
        }
    }
}

const renderInformation = (id) => {
    setNumberActive(id);

    const [titleContainer,imageContainer,descContainer] 
    = document.querySelectorAll('.side-container > *');

    titleContainer.innerHTML = "";
    imageContainer.innerHTML = "";
    descContainer.innerHTML = "";

    const img = document.createElement('img');
    const imgName = id < 10 ? `0${id}` : `${id}`;
    const imgAlt = document.createElement('p');
    const title = document.createElement('h2');
    const desc = document.createElement('p');

    title.innerText = names[id-1];
    titleContainer.append(title);

    checkIfImageExists(`images/${imgName}.png`, (exists) => {
        if (exists) {
            img.src = `images/${imgName}.png`;
            imageContainer.append(img);
        } else {
            imgAlt.innerText = `Sorry, the image for "${names[id-1]}" currently does not exist at the moment :(`;
            imageContainer.append(imgAlt);
        }
    })
    
    desc.textContent = description[id-1];
    descContainer.append(desc);
}

const setNumberActive = (id) => {
    const numbers = document.querySelectorAll('.areaNumber');

    numbers.forEach(number => {
        number.classList.remove("active");
    })

    numbers[id-1].classList.add("active");
}

document.addEventListener('DOMContentLoaded', () => {
    const img = document.querySelector('img[usemap]');
    const areas = document.querySelectorAll('map area');
    const selection = document.querySelector('#selection');
    const main = document.querySelector('.main');

    areas.forEach(area => {
        if (!area.dataset.originalCoords) {
            area.dataset.originalCoords = area.coords;
        }

        names.push(area.getAttribute("alt"));
    });

    if (img.complete) {
        scaleImageMap();
    } else {
        img.onload = scaleImageMap;
    }

    const numbers = document.querySelectorAll('.areaNumber');

    areas.forEach(area => {
        const areaId = area.title;
        area.addEventListener('click', (e) => {
            e.preventDefault();
            renderInformation(areaId);
        });
        area.addEventListener('mouseover', () => {handleAreaHover(numbers, areaId)});
        area.addEventListener('mouseout', () => handleAreaNotHover(numbers, areaId));
    });

    window.addEventListener('resize', scaleImageMap);

    selection.addEventListener('change', (e) => {
        if (e.target.value == 0) {
            window.location.reload();
        } else {
            main.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
            renderInformation(e.target.value);
        }
    })
});