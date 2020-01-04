const fetchData = async searchTerm => {
  const response = await axios.get("https://api.punkapi.com/v2/beers/", {
    params: {
      beer_name: searchTerm
    }
  });
  return response.data;
};

// helper function to delay search result
const debounce = (callback, delay) => {
  let timeOutId;
  return (...args) => {
    if (timeOutId) {
      clearTimeout(timeOutId);
    }
    timeOutId = setTimeout(() => {
      callback.apply(null, args);
    }, delay);
  };
};

const root = document.querySelector(".autocomplete");
root.innerHTML = `
    <label for="">Search for your right choice of Beer!</label>
    <input type="text" class="input">
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
        </div>
    </div>
`;

const input = document.querySelector("input");
const dropdown = document.querySelector(".dropdown");
const resultsWrapper = document.querySelector(".results");

const onInput = async e => {
  if (!e.target.value) {
    return;
  }

  const beers = await fetchData(e.target.value);
  if (!beers.length) {
    dropdown.classList.remove("is-active");
    return;
  }

  resultsWrapper.innerHTML = "";
  dropdown.classList.add("is-active");
  beers.forEach(beer => {
    const option = document.createElement("a");
    const imgSrc = beer.image_url === null ? "" : beer.image_url;

    option.classList.add("dropdown-item");
    option.innerHTML = `
      <img src="${imgSrc}"/>
      <h1>${beer.name}</h1>
      `;
    option.addEventListener("click", () => {
      dropdown.classList.remove("is-active");
      input.value = `${beer.name}`;
      document.querySelector("#summary").innerHTML = beerTemplate(beer);
    });

    resultsWrapper.appendChild(option);
  });
};

input.addEventListener("input", debounce(onInput, 1000));

// click any elements outside results and remove result
document.addEventListener("click", e => {
  if (!root.contains(e.target)) {
    dropdown.classList.remove("is-active");
  }
});

const beerTemplate = beerDetail => {
  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${beerDetail.image_url}" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${beerDetail.name}</h1>
          <h4><em>${beerDetail.tagline}</em></h4>
          <p>${beerDetail.description}</p>
        </div>
      </div>
    </article>
    `;
};
