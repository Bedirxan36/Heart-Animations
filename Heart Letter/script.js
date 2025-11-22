$(document).ready(function(){
        // Kalbe (veya yazıya) tıklayınca aç
        $('.title').click(function(e){
            e.stopPropagation(); // Olayın yukarı taşmasını engelle
            $('.container').addClass('open');
            $('.title').css('opacity', '0'); // Yazıyı gizle
        });

        // Kapatma tuşuna basınca kapat
        $('.close').click(function(e){
            e.stopPropagation();
            $('.container').removeClass('open');
            
            // Biraz bekleyip "Click Me" yazısını geri getir (kalp küçülürken)
            setTimeout(function(){
                $('.title').css('opacity', '1');
            }, 500);
        });
    });