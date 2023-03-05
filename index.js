let fetchData = [];
let categoryName;
const fetchCategories = () => {
  fetch("https://openapi.programming-hero.com/api/news/categories")
    .then((res) => res.json())
    .then((data) => showNewsCategory(data.data.news_category));
};

const showNewsCategory = (categories) => {
  const categoryContainer = document.getElementById("category-main-container");

  // ----------------------------first way to add dynamic html--------------------------

  categories.forEach((category) => {
    const div = document.createElement("p");
    div.innerHTML = `<a class="nav-link p-2" aria-current="page" href="#" onclick="singleNewsCategory('${category.category_id}','${category.category_name}')">${category.category_name}</a>
    `;
    categoryContainer.appendChild(div);
  });

  // -------------another way to add inner Html------------------------------------
  /*
  categories.forEach((category) => {
    categoryContainer.innerHTML += `
   <p><a class="nav-link " aria-current="page" href="#">${category.category_name}</a></p>`;
  });
*/
};

const singleNewsCategory = (category_id, category_name) => {
  const url = `https://openapi.programming-hero.com/api/news/category/${category_id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      fetchData = data.data;
      categoryName = category_name;
      showAllNews(data.data, category_name);
    });
};

const showAllNews = (allNewsFound, category_name) => {
  const categoryCount = document.getElementById("category-count");
  const categoryName = document.getElementById("category-name");
  categoryCount.innerText = allNewsFound.length;
  categoryName.innerText = category_name;

  const showAllNewsContainer = document.getElementById(
    "show-all-news-container"
  );
  showAllNewsContainer.innerHTML = "";
  allNewsFound.forEach((singleNews) => {
    const div = document.createElement("div");
    div.classList.add("card", "mb-3", "w-100");
    div.innerHTML = `
  <div class="row g-0">
  <div class="col-md-4">
    <img src="${
      singleNews.image_url
    }" class="img-fluid rounded-start h-100" alt="...">
  </div>
  <div class="col-md-8 d-flex flex-column container">
    <div class="card-body">
      <h5 class="card-title">${singleNews.title}</h5>
      <p class="card-text">${singleNews.details.slice(0, 200) + ".."}
      </p>
    </div>
    <div class="bg-white d-flex justify-content-between align-items-center flex-wrap">
      <div class="d-flex align-items-center">
        <img src="${singleNews.author.img}" alt="" style="width: 40px;">
        <div class="ms-2">
          <p class="m-0 p-0">${
            singleNews.author.name ? singleNews.author.name : "No Name"
          }</p>
          <p class="m-0 p-0">${singleNews.author.published_date}</p>
        </div>
      </div>
      <div><i class="fa fa-solid fa-eye"></i> <span>${
        singleNews.total_view
      }</span> </div>
      <div>
      ${generateStars(singleNews.rating.number)}
        <span>${singleNews.rating.number}</span>
      </div>
      <div><i class="fa fa-solid fa-arrow-right" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="modalDetails('${
        singleNews._id
      }')"></i></div>

    </div>
  </div>
</div>
  `;
    showAllNewsContainer.appendChild(div);
  });
};

const modalDetails = (news_id) => {
  const url = `https://openapi.programming-hero.com/api/news/${news_id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => showModal(data.data[0]));
};

const showModal = (modalData) => {
  console.log(modalData.others_info.is_trending);
  const bodyOfModal = document.getElementById("body-of-modal");
  bodyOfModal.innerHTML = `
<div class="card mb-3 w-100">
<div class="row g-0">
  <div class="col-md-12">
    <img src="${modalData.image_url}" class="img-fluid rounded-start" alt="...">
  </div>
  <div class="col-md-12 d-flex flex-column">
    <div class="card-body">
      <h5 class="card-title d-inline">${
        modalData.title
      }</h5> <span style="background-color: burlywood;font-weight: 700;font-size: large">${
    modalData.others_info.is_trending ? "Trending" : "Not Trending"
  }</span>
      <p class="card-text">${modalData.details}
      </p>
    </div>
    <div class="card-footer bg-white d-flex justify-content-between align-items-center">
      <div class="d-flex align-items-center">
        <img src="${modalData.author.img}" alt="" style="width: 40px;">
        <div class="ms-2">
          <p class="m-0 p-0">${modalData.author.name}</p>
          <p class="m-0 p-0">${modalData.author.published_date}</p>
        </div>
      </div>
      <div><i class="fa fa-solid fa-eye"> <span>${
        modalData.total_view
      }</span> </i>
      </div>
      <div>
        <i class="fa fa-solid fa-star"></i>
        <i class="fa fa-solid fa-star"></i>
        <i class="fa fa-solid fa-star"></i>
        <i class="fa fa-solid fa-star"></i>
      </div>
    </div>
  </div>
</div>
</div>
`;
};

const showTrending = () => {
  const filterNews = fetchData.filter(
    (news) => news.others_info.is_trending === true
  );
  showAllNews(filterNews, categoryName);

  // data.others_info.is_trending
};

// ------------optional task:--------
const generateStars = (rating) => {

  let ratingHTML = '';
  for (let i = 1; i <= Math.floor(rating); i++) {
    ratingHTML += '<i class="fa fa-solid fa-star"></i>';
  }
  if(rating-Math.floor(rating)>0)
  {
    ratingHTML += '<i class="fa fa-solid fa-star-half"></i>';


  }
  
  return ratingHTML;
};
