$(document).ready(function () {
    const apiKey = 'be6eac6e';
    let favorites = JSON.parse(localStorage.getItem('favorites')) || []
    const searchMovieInpt = $(".search-movie-input");
    const resultContainer = $(".result-movie-container");
    const resultListingContainer = $(".result-listing")
    const allMovie = $(".all-movie"); 
    const favoritesShow = $(".favorites span")
    let closePopupSpan = $(".close");
    let modal = $('#modalDialog');
    let listArr = [];

    resultContainer.hide();
    allMovie.hide();

    $(".watch-later").click(function() {
        $("#popup").show();
    });

    function showCookieBanner() {
        $("#cookie-banner").show();
        setTimeout(function() {
            $("#cookie-banner").hide();
        }, 10000);
    }

    if (getCookie("cookie_accepted") !== "true") {
        showCookieBanner();
        setTimeout(function() {
            showCookieBanner(); 
        }, 10000);
    }

    $("#accept-cookies").click(function() {
        setCookie("cookie_accepted", "true", 30); 
        $("#cookie-banner").hide();
    });

    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    searchMovieInpt.on( "keyup", function(e) {
        let searchValue = e.currentTarget.value;
        searchMovie(searchValue)
    });

    
    function searchMovie(searchValue){
        $(".movie-length").hide();
        if(searchValue.length > 3){
            resultContainer.html("");
            resultContainer.show();
            resultListingContainer.hide();
            allMovie.show();
            $.ajax({
                url: `http://www.omdbapi.com/?s=${searchValue}&plot=full&apikey=${apiKey}`,
                method: 'GET',
                success: function(response) {
                    if(!response.Error){
                        listArr = response.Search;
                        let results = response.Search.slice(0,2);
                        const resultContainer = $(".result-movie-container");
                        for(let item of results) {
                            
                            let resultsMovieHtml = `
                            <div class="result-movie">
                                <img src="${item.Poster}" class="result-movie-image" alt="">
                                <div class="result-movie-content">
                                    <div class="result-content-top">
                                        <h4 class="result-movie-title">${item.Title}</h4>
                                        <div class="rating">
                                            <i class="fa-regular fa-star result-movie-fav" data-id="${item.imdbID}"></i>
                                        </div>
                                    </div>
                                    <div>
                                        <div>
                                            <span class="result-content-heading">Type:</span>
                                            <span class="result-content-type">${item.Type}</span>
                                        </div>
                                        <div>
                                            <span class="result-content-heading">Year:</span>
                                            <span class="result-content-year">${item.Year}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            `
                            resultContainer.append(resultsMovieHtml);

                            favIconColor();
                        }
                    }else {
                        allMovie.hide();
                        resultContainer.hide();
                    }
                },
                error: function(error) {
                  console.error('Hata:', error);
                }
              });


        }else {
            resultContainer.hide();
            allMovie.hide();
            resultContainer.hide();
        }
    }

    $(".all-movie-route").click(function(){
        getListing();
    })

    function getListing (){
        resultContainer.html("");
        resultListingContainer.html("");
        resultContainer.hide();
        allMovie.hide();
        resultListingContainer.css("display", "grid");
        let itemLength = listArr.length;
        $(".search-movie-input").parent().after(`<span class="movie-length">${itemLength} film bulundu</span> `)
        for(let item of listArr) {
            console.log(listArr.length)
            
            let resultCollectionPage = `
                <div class="result-movie">
                    <img src="${item.Poster}" class="result-movie-image" alt="">
                    <div class="result-movie-content">
                        <div class="result-content-top">
                            <h4 class="result-movie-title">${item.Title}</h4>
                            <div class="rating">
                                <i class="fa-regular fa-star result-movie-fav" data-id="${item.imdbID}"></i>
                            </div>
                        </div>
                        <div>
                            <div>
                                <span class="result-content-heading">Type:</span>
                                <span class="result-content-type">${item.Type}</span>
                            </div>
                            <div>
                                <span class="result-content-heading">Year:</span>
                                <span class="result-content-year">${item.Year}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `
            resultListingContainer.append(resultCollectionPage);
            favIconColor();
        }
    }

    $(document).on('click', '.result-movie-fav', function() {
        let favData = $(this).attr('data-id');
        let parentElement = $(this).closest('.modal-body');
        let resultMovieElement = $(this).closest('.result-movie');
        searchMovieInpt.val("");

        if (parentElement.hasClass('modal-body')) {
            resultMovieElement.remove();
        }

        let existingIndex = favorites.findIndex(function(fav) {
            return fav.imdbID === favData;
        });
    
        if (existingIndex !== -1) {
            favorites.splice(existingIndex, 1);
            localStorage.setItem('favorites', JSON.stringify(favorites));
    
            $(this).removeClass('favorited'); 
            Swal.fire({
                icon: 'success',
                text: 'Film favorilerden kaldırıldı.'
            });
        } else {
            let foundMovie = listArr.find(function(movie) {
                return movie.imdbID === favData;
            });
    
            if (foundMovie) {
                let isAlreadyAdded = favorites.some(function(fav) {
                    return fav.imdbID === favData;
                });
    
                if (!isAlreadyAdded) {
                    favorites.push(foundMovie);
                    localStorage.setItem('favorites', JSON.stringify(favorites));
    
                    $(this).addClass('favorited'); 
                    Swal.fire({
                        icon: 'success',
                        text: 'Favorilere eklendi!'
                    });
                } else {
                    Swal.fire({ 
                        icon: 'error',
                        text: 'Film zaten favorilerinizde bulunuyor!'
                    });
                }
            } else {
                console.log('Film bulunamadı.');
            }
        }
    });

   
    favoritesShow.click(function(){
        showFavorites();
    })

    function showFavorites(e) {
        resultContainer.hide();
        allMovie.hide();
        $(".search-movie-input").val("")
        if (favorites.length > 0) {
            $('.modal-body').html('')
            for (let item of favorites) {
                let resultsMovieHtml = `
                    <div class="result-movie">
                        <img src="${item.Poster}" class="result-movie-image" alt="">
                        <div class="result-movie-content">
                            <div class="result-content-top">
                                <h4 class="result-movie-title">${item.Title}</h4>
                                <div class="rating">
                                    <i class="fa-regular fa-star result-movie-fav" data-id="${item.imdbID}"></i>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <span class="result-content-heading">Type:</span>
                                    <span class="result-content-type">${item.Type}</span>
                                </div>
                                <div>
                                    <span class="result-content-heading">Year:</span>
                                    <span class="result-content-year">${item.Year}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                $(".modal-body").append(resultsMovieHtml);
                favIconColor();
            }
        } else {
            $(".modal-body").append("<p>Favoriler boş</p>");
        }
        
        modal.show();
    }

    function favIconColor () {
        $('.result-movie-fav').each(function() {
            var imdbID = $(this).attr('data-id');
    
            var isAdded = favorites.some(function(fav) {
                return fav.imdbID === imdbID;
            });
    
            if (isAdded) {
                $(this).addClass('favorited');
            }
        });
    }

    $('body').bind('click', function(e){
        if($(e.target).hasClass("modal")){
            modal.fadeOut();
        }
    });

   
        
    closePopupSpan.on('click', function() {
        modal.fadeOut();
    });
  });   
