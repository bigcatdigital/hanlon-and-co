<footer>
			<div class="bc-content-container">
				<div class="bc-content-grid bc-cols-3">	
					<?php 
						$contact_info = new WP_Query([
						'post_type' => 'contact-information'
						]);	
						
						while ($contact_info->have_posts()) {
							$contact_info->the_post() ; ?>
					<div class="bc-col">
						<?php if (get_field('contact-#1')) {
							$contact_1 = get_field('contact-#1'); ?>
						<h2 class="ca-contact-office"><?php echo esc_html($contact_1['office-name']) ?></h2>
						<p class="ca-contact-detail"><?php echo $contact_1['office-detail'] ?></p>
							<?php if ($contact_1['office-number']) { ?>
						<h3>Phone</h3>
						<p class="ca-contact-detail"><a href="tel:<?php echo $contact_1['office-number'] ?>">+353 <?php echo $contact_1['office-number'] ?></a></p>
							<?php }//end if 'office-number' ?>
						<?php }//end if 'contact-#1' ?>
						<?php if (get_field('contact-main-email')) { ?>
						<h3 class="ca-contact-office-sub">Email</h3>
						<p class="ca-contact-detail"><a href="mailto:<?php echo get_field('contact-main-email') ?>"><?php echo get_field('contact-main-email'); ?></a></p>
						<?php }//end if 'contact-main-phone-email' ?>
					</div>
					<div class="bc-col">
					<?php if (get_field('contact-#2')) {
						$contact_2 = get_field('contact-#2'); ?>
						<h2 class="ca-contact-office"><?php echo esc_html($contact_2['office-name']) ?></h2>
						<p class="ca-contact-detail"><?php echo $contact_2['office-detail'] ?></p>
							<?php if ($contact_2['office-number']) { ?>
						<h3>Phone</h3>
						<p class="ca-contact-detail"><a href="tel:<?php echo $contact_2['office-number'] ?>">+353 <?php echo $contact_2['office-number'] ?></a></p>
							<?php }//end if 'office-number' ?>
					<?php }//end if 'contact-#2' ?>
					</div>
						<?php if (get_field('contact-social-media-profiles')) { 
							$soc_media_profiles = get_field('contact-social-media-profiles'); ?>	
					<div class="bc-col">	
						<h2 class="ca-contact-office">Follow</h2>
							<p class="ca-contact-detail">
							<?php if ($soc_media_profiles['soc-media-#1']) { ?>
								<a href="<?php echo esc_url($soc_media_profiles['soc-media-#1']['url']) ?>"><?php echo $soc_media_profiles['soc-media-#1']['title'] ?></a>
							<?php }// end if 'soc-media-#1'  ?>
							<?php if ($soc_media_profiles['soc-media-#2']) { ?>
								<br />
								<a href="<?php echo esc_url($soc_media_profiles['soc-media-#2']['url']) ?>"><?php echo $soc_media_profiles['soc-media-#2']['title'] ?></a>
							<?php }// end if 'soc-media-#2'  ?>
							<?php if ($soc_media_profiles['soc-media-#3']) { ?>
								<br />
								<a href="<?php echo esc_url($soc_media_profiles['soc-media-#3']['url']) ?>"><?php echo $soc_media_profiles['soc-media-#3']['title'] ?></a>
							<?php }// end if 'soc-media-#3'  ?>
							<?php if ($soc_media_profiles['soc-media-#4']) { ?>
								<br />
								<a href="<?php echo esc_url($soc_media_profiles['soc-media-#4']['url']) ?>"><?php echo $soc_media_profiles['soc-media-#4']['title'] ?></a>
							<?php }// end if 'soc-media-#4'  ?>
							<?php if ($soc_media_profiles['soc-media-#5']) { ?>
								<br />
								<a href="<?php echo esc_url($soc_media_profiles['soc-media-#5']['url']) ?>"><?php echo $soc_media_profiles['soc-media-#5']['title'] ?></a>
							<?php }// end if 'soc-media-#4'  ?>
							</p>
					</div>	
						<?php }//end if 'contact-social-media-profiles' ?>
					<?php }//end while contact-info ?>
				</div>
			</div>
		</footer>
		<script src="https://unpkg.com/flickity@2/dist/flickity.pkgd.js"></script>
		<?php wp_footer() ?>
	</body>
</html>